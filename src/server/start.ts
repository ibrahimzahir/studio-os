import 'dotenv/config';
import { buildApi } from './api/app';
const app = buildApi();
await app.listen({ host: '127.0.0.1', port: 4000 });
console.log('Studio OS API ready on http://127.0.0.1:4000');
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => { void app.close().then(() => process.exit(0)); });
