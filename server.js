import express from "express";
import { APP_HOST, APP_PORT } from "./config";
import connectToDb from "./db";
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes";

const app = express();

// Connect to database 
connectToDb();

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

app.listen(APP_PORT, () => console.log(`Your site running at ${APP_HOST}:${APP_PORT}/`))