import { spawn } from 'node:child_process';
const processes = [spawn(process.execPath, ['--import', 'tsx', 'src/server/start.ts'], { stdio: 'inherit', env: process.env }), spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1'], { stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } })];
let stopping = false;
function stop(code = 0) { if (stopping) return; stopping = true; for (const child of processes) child.kill('SIGTERM'); process.exitCode = code; }
for (const child of processes) { child.on('error', () => stop(1)); child.on('exit', code => stop(code ?? 1)); }
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => stop());
