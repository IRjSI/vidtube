import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});