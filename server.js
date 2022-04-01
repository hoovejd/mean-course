import { createServer } from 'http';
import { app } from './api/app.js';

const hostname = '127.0.0.1';
const port = 3000;

app.set('port', port);
const server = createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
