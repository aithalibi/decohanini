import http from 'node:http';
import next from 'next';

const port = Number.parseInt(process.env.PORT || '3000', 10);
const hostname = '0.0.0.0';

const app = next({
  dev: false,
  hostname,
  port,
});

const handle = app.getRequestHandler();

try {
  await app.prepare();

  http
    .createServer((request, response) => {
      handle(request, response);
    })
    .listen(port, hostname, () => {
      console.log(`Deco Hanini running on ${hostname}:${port}`);
    });
} catch (error) {
  console.error('Failed to start the application:', error);
  process.exit(1);
}
