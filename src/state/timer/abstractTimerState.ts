import { Renderer } from '../../renderer';
import { Timer } from '../../timer';
import { PauseTimerState } from './pauseTimerState';
import { StartTimerState } from './startTimerState';

type State = StartTimerState | PauseTimerState;

export abstract class TimerState {
  protected static instance: State;
  // Instance of a class that displays the time on the status bar
  protected renderer: Renderer;

  constructor() {
    this.renderer = Renderer.getInstance();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public static getInstance() {}

  abstract start(timer: Timer, color: string): void;

  public pause(timer: Timer, state: State, color: string) {
    this.changeTimerState(timer, state);
    this.renderer.changeIcon(timer.timerState);
    this.renderer.render(timer.remainingDuration);
    this.renderer.changeCommand({ isPaused: true, color });
  }

  public resume(timer: Timer, state: State, color: string) {
    this.changeTimerState(timer, state);
    this.renderer.changeIcon(timer.timerState);
    this.renderer.render(timer.remainingDuration);
    this.renderer.changeCommand({ isPaused: false, color });
  }

  private changeTimerState(timer: Timer, state: State) {
    timer.changeState(state);
  }

  public reset(timer: Timer, state: State, color: string) {
    if (!timer.intervalId) return;

    clearInterval(timer.intervalId);
    timer.intervalId = null;

    timer.remainingDuration = timer.kirokuState.time;
    timer.changeState(state);
    this.renderer.changeCommand({ isPaused: true, color });
  }
}
