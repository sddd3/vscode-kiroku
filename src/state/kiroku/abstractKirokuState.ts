import { Kiroku } from '../../kiroku';
import { Renderer } from '../../renderer';
import { Timer } from '../../timer';

export abstract class KirokuState {
  // Value retrieved from settings. break time.
  public abstract readonly time: number;
  // Timer instance
  public abstract timer: Timer;
  // Kiroku instance
  protected readonly kiroku: Kiroku;
  // Instance of a class that displays the time on the status bar
  protected renderer: Renderer;
  // Text color when displayed in status bar
  public abstract readonly color: string;

  constructor(kiroku: Kiroku) {
    this.kiroku = kiroku;
    this.renderer = Renderer.getInstance();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public static getInstance(_kiroku: Kiroku) {}

  /**
   * Running timer
   */
  public abstract run(): void;

  /**
   * Process when timer ends.
   */
  public abstract done(workTime: number): void;

  /**
   * Pause timer
   */
  public pause() {
    this.timer.pause();
  }

  /**
   * Rest timer
   */
  public abstract reset(): void;

  public finish() {
    this.timer.finish();
  }
}
