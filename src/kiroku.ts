import { workspace } from 'vscode';

import { Renderer } from './renderer';
import { IntervalKirokuState } from './state/kiroku/intervalKirokuState';
import { RunningKirokuState } from './state/kiroku/runningKirokuState';
import { TimeRecorder } from './timeRecorder';

type KirokuState = RunningKirokuState | IntervalKirokuState;

export class Kiroku {
  private state: KirokuState;
  private renderer: Renderer;

  constructor() {
    this.state = RunningKirokuState.getInstance(this);
    this.renderer = Renderer.getInstance();
    this.initView(this.state);
  }

  /**
   * Running timer
   */
  public run() {
    this.state.run();
  }

  /**
   * Pause timer
   */
  public pause() {
    this.state.pause();
  }

  /**
   * Rest timer
   */
  public reset() {
    this.state.reset();
  }

  /**
   * Record work time
   */
  private async record() {
    if (workspace.getConfiguration('kiroku').time.taskName === '') return;

    const timeRecorder = new TimeRecorder();
    const json = await timeRecorder.import();
    if (!json) return;

    timeRecorder.recordTask(json);
  }

  /**
   * Change Kiroku status
   * @param state Running, Pause
   */
  public changeState(state: KirokuState) {
    if (state instanceof IntervalKirokuState) {
      this.record();
    }

    this.state = state;
  }

  /**
   * Initialize view
   * @param state
   */
  public initView(state: KirokuState) {
    this.renderer.render(state.time);
  }
}
