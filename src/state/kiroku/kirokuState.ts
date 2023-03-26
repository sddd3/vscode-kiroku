export interface KirokuState {
  run: () => void;
  done: () => void;
  pause: () => void;
  reset: () => void;
}
