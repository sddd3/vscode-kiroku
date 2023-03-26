import { window, workspace } from 'vscode';

import { Kiroku } from '../../kiroku';
import { Renderer } from '../../renderer';
import { Timer } from '../../timer';
import { PauseTimerState } from '../timer/pauseTimerState';
import { KirokuState } from './kirokuState';
import { RunningKirokuState } from './runningKirokuState';

export class IntervalKirokuState implements KirokuState {
  private static instance: IntervalKirokuState;
  // Value retrieved from settings. break time.
  public readonly time: number;
  // Timer instance
  public timer: Timer;
  // Kiroku instance
  private readonly kiroku: Kiroku;
  // Instance of a class that displays the time on the status bar
  private renderer: Renderer;
  // Text color when displayed in status bar
  public readonly color = '#ff9e3d';

  private constructor(kiroku: Kiroku) {
    this.time = Math.floor(workspace.getConfiguration('kiroku').time.interval * 60000);
    this.timer = new Timer(this);
    this.kiroku = kiroku;
    this.renderer = Renderer.getInstance();
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
  public done() {
    const runningState = RunningKirokuState.getInstance(this.kiroku);
    this.kiroku.changeState(runningState);
    this.kiroku.initView(runningState);
    this.renderer.changeCommand({ isPaused: true, color: runningState.color });
    window.showInformationMessage('Break time is finished.');
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
