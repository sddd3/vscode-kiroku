import { commands, ExtensionContext, window, workspace } from 'vscode';
import { z, ZodError } from 'zod';

import { Kiroku } from './kiroku';
import { Config } from './types/config';

export function activate(context: ExtensionContext) {
  const config = workspace.getConfiguration('kiroku');
  const { running, interval, taskName } = config.time;

  try {
    validConfig({ running, interval, taskName });
    const kiroku = new Kiroku();
    registCommands(context, kiroku);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      error.flatten().formErrors.map((message) => window.showErrorMessage(message));
      registCommandsError(context);
    } else {
      window.showErrorMessage('kiroku is error.');
    }
    return;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}

/**
 * Check for necessary settings
 * @param config
 * @returns
 */
const validConfig = (config: Config) => {
  const validTime = z
    .number()
    .gte(1, 'kiroku : The minimum value that can be set is 1 minute.')
    .lte(60, 'kiroku : The maximum value that can be set is 60 minutes.');
  validTime.parse(config.running);
  validTime.parse(config.interval);
  const validTaskName = z.string().max(24, 'kiroku : The maximum number of characters is 20.');
  validTaskName.parse(config.taskName);
};

/**
 * Register command
 * @param context
 */
const registCommands = (context: ExtensionContext, kiroku: Kiroku) => {
  const run = commands.registerCommand('Kiroku.run', () => {
    kiroku.run();
  });

  const pause = commands.registerCommand('Kiroku.pause', () => {
    kiroku.pause();
  });

  const reset = commands.registerCommand('Kiroku.reset', () => {
    kiroku.reset();
  });

  const finish = commands.registerCommand('Kiroku.finish', () => {
    kiroku.finish();
  });

  const setConfig = commands.registerCommand('Kiroku.config', () => {
    commands.executeCommand('workbench.action.openSettings', 'Kiroku');
  });

  context.subscriptions.push(run, pause, reset, finish, setConfig);
};

/**
 * For setting values that are invalid and do not register commands.
 */
const registCommandsError = (context: ExtensionContext) => {
  const run = commands.registerCommand('Kiroku.run', () => {
    commands.executeCommand('workbench.action.openSettings', 'Kiroku');
  });

  const pause = commands.registerCommand('Kiroku.pause', () => {
    commands.executeCommand('workbench.action.openSettings', 'Kiroku');
  });

  const reset = commands.registerCommand('Kiroku.reset', () => {
    commands.executeCommand('workbench.action.openSettings', 'Kiroku');
  });

  const finish = commands.registerCommand('Kiroku.finish', () => {
    commands.executeCommand('workbench.action.openSettings', 'Kiroku');
  });

  const setConfig = commands.registerCommand('Kiroku.config', () => {
    commands.executeCommand('workbench.action.openSettings', 'Kiroku');
  });

  context.subscriptions.push(run, pause, reset, finish, setConfig);
};
