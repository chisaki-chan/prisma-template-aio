// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require('child_process');

const child = exec('npm run start:prod', { cwd: __dirname, windowsHide: true });

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
