import { TextEncoder } from 'util';
import { Uri, window, workspace, WorkspaceFolder } from 'vscode';

import { Kiroku, Task } from './types/kiroku';

export class TimeRecorder {
  private taskName: string;
  private time: number;
  private workspaceFolders: readonly WorkspaceFolder[] | undefined;
  constructor() {
    this.taskName = workspace.getConfiguration('kiroku').time.taskName;
    this.time = workspace.getConfiguration('kiroku').time.running;
    this.workspaceFolders = workspace.workspaceFolders;
  }

  /**
   * Record work time
   * @param kiroku
   */
  public async recordTask(kiroku: Kiroku, elapsedTime: number) {
    if (!kiroku[this.taskName]) {
      kiroku = await this.createNewTask(kiroku);
    }

    const time = elapsedTime ? elapsedTime : this.time;

    const dateObj = new Date();
    const date = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj
      .getDate()
      .toString()
      .padStart(2, '0')}`;
    if (0 < kiroku[this.taskName].done.length) {
      const index = kiroku[this.taskName].done.findIndex((task) => task.date === date);
      if (0 <= index) {
        kiroku[this.taskName].done[index].time += time;
      } else {
        kiroku[this.taskName].done.push({ time: time, date });
      }
    } else {
      kiroku[this.taskName].done.push({ time: time, date });
    }
    kiroku[this.taskName].all = Number(kiroku[this.taskName].all) + time;

    this.export(JSON.stringify(kiroku));
  }

  /**
   * Register new task in kiroku.json
   * @param kiroku
   * @returns
   */
  private async createNewTask(kiroku: Kiroku) {
    const newTask: Task = { done: [], all: 0 };
    return { ...kiroku, [this.taskName]: newTask };
  }

  /**
   * Convert kiroku.json to a JSON object and return
   * @returns
   */
  public async import() {
    if (!this.workspaceFolders) return;

    const filePath = `${this.workspaceFolders[0].uri.path}/.vscode/kiroku.json`;

    const isExist = await this.checkFileExist(filePath);
    if (!isExist) {
      await this.createVscodeDir();
      await this.createKirokuJson();
    }

    return await this.getJsonData(filePath);
  }

  /**
   * Output strings to kiroku.json
   * @param content Output String
   * @returns
   */
  public async export(content = '') {
    if (!this.workspaceFolders) return;

    const filePath = `${this.workspaceFolders[0].uri.path}/.vscode/kiroku.json`;
    return await workspace.fs.writeFile(Uri.file(filePath), new TextEncoder().encode(content)).then(
      () => true,
      () => false
    );
  }

  /**
   * File existence check function
   * @param filePath path where the file is stored
   * @returns
   */
  public async checkFileExist(filePath: string) {
    return await workspace.fs.stat(Uri.file(filePath)).then(
      () => true,
      () => false
    );
  }

  /**
   * Get kiroku.json
   * @param filePath path where the file is stored
   * @returns
   */
  public async getJsonData(filePath: string): Promise<Kiroku | false> {
    const jsonData = await workspace.fs.readFile(Uri.file(filePath)).then(
      (data) => {
        try {
          return JSON.parse(data.toString());
        } catch (error) {
          window.showErrorMessage(`JSON parsing failed. path : '${filePath}'.`);
          return false;
        }
      },
      (error) => {
        window.showErrorMessage(`Failed to read file '${filePath}'. ${error}`);
        return false;
      }
    );

    return jsonData;
  }

  /**
   * Create .vscode
   * @returns
   */
  public async createVscodeDir() {
    if (!this.workspaceFolders) return;

    const filePath = `${this.workspaceFolders[0].uri.path}/.vscode`;

    const isExist = await this.checkFileExist(filePath);
    if (isExist) return;

    workspace.fs.createDirectory(Uri.file(filePath)).then(
      () => {
        window.showInformationMessage(`Created '${filePath}'.`);
      },
      () => {
        window.showErrorMessage(`Create failed '${filePath}'.`);
      }
    );
  }

  /**
   * Create kiroku.json
   * @returns
   */
  public async createKirokuJson() {
    if (!this.workspaceFolders) return;

    const filePath = `${this.workspaceFolders[0].uri.path}/.vscode/kiroku.json`;
    const content = new TextEncoder().encode('{}');

    const isExist = await this.checkFileExist(filePath);
    if (isExist) return;

    return await workspace.fs.writeFile(Uri.file(filePath), content).then(
      () => true,
      () => false
    );
  }
}
