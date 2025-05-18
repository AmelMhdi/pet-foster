import { createServer } from 'node:http';
import { app } from "./src/app.js";

const server = createServer(app);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});