import { window, workspace } from 'vscode';

import { Kiroku } from '../../kiroku';
import { Timer } from '../../timer';
import { PauseTimerState } from '../timer/pauseTimerState';
import { KirokuState } from './abstractKirokuState';
import { IntervalKirokuState } from './intervalKirokuState';

export class RunningKirokuState extends KirokuState {
  private static instance: RunningKirokuState;
  // Value retrieved from settings. running time.
  public readonly time: number;
  // Timer instance
  public timer: Timer;
  // Text color when displayed in status bar
  public readonly color = '#00ffff';

  private constructor(kiroku: Kiroku) {
    super(kiroku);
    this.time = Math.floor(workspace.getConfiguration('kiroku').time.running * 60000);
    this.timer = new Timer(this);
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
  public done(elapsedTime: number) {
    const intervalState = IntervalKirokuState.getInstance(this.kiroku);
    this.kiroku.changeState(intervalState, elapsedTime);
    this.kiroku.initView(intervalState);
    this.renderer.changeCommand({ isPaused: true, color: intervalState.color });
    window.showInformationMessage('Work is finished.');
  }

  /**
   * Rest timer
   */
  public reset() {
    this.timer.reset();
    this.kiroku.initView(this);
  }
}
