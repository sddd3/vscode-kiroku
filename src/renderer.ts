import { StatusBarAlignment, StatusBarItem, window } from 'vscode';

import { PauseTimerState } from './state/timer/pauseTimerState';
import { StartTimerState } from './state/timer/startTimerState';

type options = {
  isPaused: boolean;
  color: string;
};

type TimerState = StartTimerState | PauseTimerState;

export class Renderer {
  private static instance: Renderer;
  private statusBarItem: StatusBarItem;
  private statusIcon: string;

  private constructor() {
    this.statusBarItem = this.createStatusBarItem();
    this.statusBarItem.show();
    this.statusIcon = '$(debug-start)';
  }

  /**
   * Get an instance of IntervalState
   * @returns IntervalState
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new Renderer();
    }
    return this.instance;
  }

  /**
   * Create time to display on status bar
   * @returns
   */
  private createStatusBarItem = () => {
    const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 0);
    statusBarItem.text = `00:00`;
    statusBarItem.command = 'Kiroku.run';
    statusBarItem.color = '#00FFFF';

    return statusBarItem;
  };

  /**
   * rendering function
   */
  public render(milliseconds: number) {
    // milliseconds % 60000 = 上記式のあまりなので残り秒数がミリ秒で産出され、それを秒に直すために1000で割る
    const minutes = Math.floor(milliseconds / 60000)
    .toString()
    .padStart(2, '0');
    // 1000ミリ秒 = 1秒 : 1500000ミリ秒(25分) / 1000(1秒) = 1500秒 : 1500秒 / 60(1分は60秒) = 25分
    const seconds = Math.floor((milliseconds % 60000) / 1000)
      .toString()
      .padStart(2, '0');
    this.statusBarItem.text = `${this.statusIcon}  ${minutes} : ${seconds}`;
  }

  public changeCommand(options: options) {
    this.statusBarItem.command = options && options.isPaused ? 'Kiroku.run' : 'Kiroku.pause';
    this.statusBarItem.color = options && options.isPaused ? '#ff6347' : options.color;
  }

  public changeIcon(state: TimerState) {
    this.statusIcon = state instanceof StartTimerState ? '$(debug-pause)' : '$(debug-start)';
  }
}
