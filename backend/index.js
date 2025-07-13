import { createServer } from 'node:http';
import { app } from "./src/app.js";

const server = createServer(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});