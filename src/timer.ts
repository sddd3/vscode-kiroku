import { Renderer } from './renderer';
import { IntervalKirokuState } from './state/kiroku/intervalKirokuState';
import { RunningKirokuState } from './state/kiroku/runningKirokuState';
import { PauseTimerState } from './state/timer/pauseTimerState';
import { StartTimerState } from './state/timer/startTimerState';

type KirokuState = RunningKirokuState | IntervalKirokuState;
type TimerState = StartTimerState | PauseTimerState;

export class Timer {
  // Return value of setInterval is stored.
  public intervalId: NodeJS.Timer | null;
  // Timer Status
  public timerState: TimerState;
  // Time remaining on timer
  public remainingDuration: number;
  // Current Kiroku status
  public kirokuState: KirokuState;

  constructor(kirokuState: KirokuState) {
    this.kirokuState = kirokuState;
    this.remainingDuration = this.kirokuState.time;
    this.intervalId = null;
    this.timerState = StartTimerState.getInstance();
  }

  public start() {
    this.timerState = StartTimerState.getInstance();
    if (this.intervalId === null) {
      this.intervalId = setInterval(() => {
        this.timerState.start(this, this.kirokuState.color);
        if (this.remainingDuration <= 0) {
          this.reset();
          this.kirokuState.done(this.kirokuState.time / 60000);
        }
      }, 1000);
    }
  }

  public pause() {
    this.timerState.pause(this, PauseTimerState.getInstance(), this.kirokuState.color);
  }

  public resume() {
    this.timerState.resume(this, StartTimerState.getInstance(), this.kirokuState.color);
  }

  public reset() {
    this.timerState.reset(this, StartTimerState.getInstance(), this.kirokuState.color);
    Renderer.getInstance().changeIcon(PauseTimerState.getInstance());
  }

  public finish() {
    const elapsedTime = Math.ceil(this.kirokuState.time - this.remainingDuration / 60000);
    this.reset();
    this.kirokuState.done(elapsedTime);
  }

  public changeState(state: TimerState) {
    this.timerState = state;
  }

  public getTimerState() {
    return this.timerState;
  }
}
