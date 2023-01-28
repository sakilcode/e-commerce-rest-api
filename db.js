import mongoose from "mongoose";
import { DB_URL } from "./config";

const connectToDb = async () => {
    await mongoose.connect(DB_URL);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Connection error"))
    db.once('open', () => {
        console.log("DB connected..")
    })
}

export default connectToDb;