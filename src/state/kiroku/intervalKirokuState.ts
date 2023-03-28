import { window, workspace } from 'vscode';

import { Kiroku } from '../../kiroku';
import { Timer } from '../../timer';
import { PauseTimerState } from '../timer/pauseTimerState';
import { KirokuState } from './abstractKirokuState';
import { RunningKirokuState } from './runningKirokuState';

export class IntervalKirokuState extends KirokuState {
  private static instance: IntervalKirokuState;
  // Value retrieved from settings. break time.
  public readonly time: number;
  // Timer instance
  public timer: Timer;
  // Text color when displayed in status bar
  public readonly color = '#ff9e3d';

  private constructor(kiroku: Kiroku) {
    super(kiroku);
    this.time = Math.floor(workspace.getConfiguration('kiroku').time.interval * 60000);
    this.timer = new Timer(this);
  }

  /**
   * Get IntervalKirokuState instance
   * @returns IntervalKirokuState
   */
  public static getInstance(kiroku: Kiroku) {
    if (!this.instance) {
      this.instance = new IntervalKirokuState(kiroku);
    }

    return this.instance;
  }

  /**
   * Running timer
   */
  public run() {
    if (this.timer.getTimerState() instanceof PauseTimerState) {
      this.timer.resume();
    }

    this.timer.start();
  }

  /**
   * Process when timer ends.
   */
  public done(elapsedTime: number) {
    const runningState = RunningKirokuState.getInstance(this.kiroku);
    this.kiroku.changeState(runningState, elapsedTime);
    this.kiroku.initView(runningState);
    this.renderer.changeCommand({ isPaused: true, color: runningState.color });
    window.showInformationMessage('Break time is finished.');
  }

  /**
   * Rest timer
   */
  public reset() {
    this.timer.reset();
    this.kiroku.initView(this);
  }
}
