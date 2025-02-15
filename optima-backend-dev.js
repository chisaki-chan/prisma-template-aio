// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require('child_process');

const child = exec('bun run --watch src/app.ts', { cwd: __dirname, windowsHide: true });

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
