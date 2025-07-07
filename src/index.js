import { server } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();

const PORT = 4000 || process.env.PORT;

connectDB();

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
