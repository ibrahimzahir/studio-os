import 'dotenv/config';
import { buildApi } from './api/app';

const host = process.env.API_HOST ?? '127.0.0.1';
const parsedPort = Number(process.env.API_PORT ?? '4000');
const port = Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? parsedPort : 4000;

const app = buildApi();
await app.listen({ host, port });
console.log(`Studio OS API ready on http://${host}:${port}`);
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    void app.close().then(() => process.exit(0));
  });
}
