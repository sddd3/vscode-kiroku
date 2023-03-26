import { TimerState } from './abstractTimerState';

export class PauseTimerState extends TimerState {
  constructor() {
    super();
  }
  public static getInstance() {
    if (!this.instance) {
      this.instance = new PauseTimerState();
    }
    return this.instance;
  }

  public override start() {
    return;
  }
}
