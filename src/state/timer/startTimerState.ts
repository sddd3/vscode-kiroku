import { Timer } from '../../timer';
import { TimerState } from './abstractTimerState';

export class StartTimerState extends TimerState {
  constructor() {
    super();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new StartTimerState();
    }
    return this.instance;
  }

  public override start(timer: Timer, color: string) {
    timer.remainingDuration -= 1000;
    this.renderer.changeIcon(timer.timerState);
    this.renderer.render(timer.remainingDuration);
    this.renderer.changeCommand({ isPaused: false, color });
  }
}
