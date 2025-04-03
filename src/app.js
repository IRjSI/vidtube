import express from "express"
import cors from "cors"
import router from "./routes/healthCheck.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/v1/healthcheck',router)

export { app };