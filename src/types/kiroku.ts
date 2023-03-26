export type Kiroku = {
  [key: string]: Task;
};

export type Task = {
  done: Array<Record>;
  all: number;
};

export type Record = {
  time: number;
  date: string;
};
