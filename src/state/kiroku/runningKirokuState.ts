import { window, workspace } from 'vscode';

import { Kiroku } from '../../kiroku';
import { Renderer } from '../../renderer';
import { Timer } from '../../timer';
import { PauseTimerState } from '../timer/pauseTimerState';
import { IntervalKirokuState } from './intervalKirokuState';
import { KirokuState } from './kirokuState';

export class RunningKirokuState implements KirokuState {
  private static instance: RunningKirokuState;
  // Value retrieved from settings. running time.
  public readonly time: number;
  // Timer instance
  public timer: Timer;
  // Kiroku instance
  private readonly kiroku: Kiroku;
  // Instance of a class that displays the time on the status bar
  private renderer: Renderer;
  // Text color when displayed in status bar
  public readonly color = '#00ffff';

  private constructor(kiroku: Kiroku) {
    this.time = Math.floor(workspace.getConfiguration('kiroku').time.running * 60000);
    this.timer = new Timer(this);
    this.kiroku = kiroku;
    this.renderer = Renderer.getInstance();
  }

  /**
   * Get RunningKirokuState instance
   * @returns RunningKirokuState
   */
  public static getInstance(kiroku: Kiroku) {
    if (!this.instance) {
      this.instance = new RunningKirokuState(kiroku);
    }

    return this.instance;
  }

  /**
   * Running timer
   */
  public run() {
    if (this.timer.getTimerState() instanceof PauseTimerState) {
      this.timer.resume();
      return;
    }

    this.timer.start();
  }

  /**
   * Process when timer ends.
   */
  public done() {
    const intervalState = IntervalKirokuState.getInstance(this.kiroku);
    this.kiroku.changeState(intervalState);
    this.kiroku.initView(intervalState);
    this.renderer.changeCommand({ isPaused: true, color: intervalState.color });
    window.showInformationMessage('Work is finished.');
  }

  /**
   * Pause timer
   */
  public pause() {
    this.timer.pause();
  }

  /**
   * Rest timer
   */
  public reset() {
    this.timer.reset();
    this.kiroku.initView(this);
  }
}
