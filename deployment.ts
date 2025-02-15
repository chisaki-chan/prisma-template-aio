import { exec } from 'child_process';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const username = process.env.GIT_USERNAME;
const password = process.env.GIT_PASSWORD;

if (!username || !password) {
  console.error('Username or password not found in .env file');
  process.exit(1);
}

const gitPullCommand = `git pull https://${username}:${password}@repository.aio.co.id/framdani/project-management-api.git`;
const npmTestCommand = 'npm run test';
const pm2RestartCommand = 'pm2 restart optima-backend';

exec(gitPullCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing git pull: ${error.message}`);
    return;
  }
  console.log(`git pull output: ${stdout}`);
  console.error(`git pull errors: ${stderr}`);

  exec(npmTestCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing npm test: ${error.message}`);
      return;
    }
    console.log(`npm test output: ${stdout}`);
    console.error(`npm test errors: ${stderr}`);

    exec(pm2RestartCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing pm2 restart: ${error.message}`);
        return;
      }
      console.log(`pm2 restart output: ${stdout}`);
      console.error(`pm2 restart errors: ${stderr}`);
    });
  });
});
