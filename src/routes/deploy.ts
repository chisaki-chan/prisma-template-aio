import type { Request, Response } from 'express';

import { spawn } from 'child_process';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
const username = process.env.GIT_USERNAME;
const password = process.env.GIT_PASSWORD;

const gitPullCommand = `git pull https://${username}:${password}@repository.aio.co.id/framdani/project-management-api.git`;
const npmTestCommand = 'npm run test';
const pm2RestartCommand = `pm2 restart ${
  process.env.MODE === 'production' ? 'optima-backend' : 'optima-backend-dev'
}`;

function runCommand(
  command: string,
  args: string[],
  callback: (error: Error | null, stdout: string, stderr: string) => void,
  res: Response
) {
  const process = spawn(command, args, { shell: true });

  let stdout = '';
  let stderr = '';

  console.log(command, args);

  process.stdout.on('data', (data) => {
    stdout += data.toString();
    console.log('out ', data.toString());
    res.write(data.toString());
  });

  process.stderr.on('data', (data) => {
    stderr += data.toString();
    console.log('err ', data.toString());
    res.write(data.toString());
  });

  process.on('close', (code) => {
    if (code !== 0) {
      callback(new Error(`Command failed with exit code ${code}`), stdout, stderr);
    } else {
      callback(null, stdout, stderr);
    }
  });
}

export const post = async (req: Request, res: Response) => {
  if (!username || !password) {
    console.error('Username or password not found in .env file');
    res.status(500).send('Username or password not found in .env file');
    process.exit(1);
  }

  const gitPullSplitted = gitPullCommand.split(' ');

  runCommand(
    gitPullSplitted[0],
    gitPullSplitted.slice(1),
    (error, stdout, stderr) => {
      const npmTestSplitted = npmTestCommand.split(' ');

      runCommand(
        npmTestSplitted[0],
        npmTestSplitted.slice(1),
        (error, stdout, stderr) => {
          const pm2RestartSplitted = pm2RestartCommand.split(' ');

          runCommand(
            pm2RestartSplitted[0],
            pm2RestartSplitted.slice(1),
            (error, stdout, stderr) => {
              console.log(`pm2 restart output: ${stdout}`);
              console.error(`pm2 restart errors: ${stderr}`);
            },
            res
          );
        },
        res
      );
    },
    res
  );

  res.end();
};

export const get = async (req: Request, res: Response) => {
  let i = 0;
  while (i < 10) {
    res.write(`${i}: Hello world\n`);
    process.stdout.write(`${i}: Hello world\n`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    i++;
  }
  res.end();
};
