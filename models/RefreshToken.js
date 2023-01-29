import mongoose, { Schema } from "mongoose";

const refreshTokenSchema = new Schema({
    token: { type: String, unique: true, required: true },
});

export default mongoose.model("RefreshToken", refreshTokenSchema, "refreshTokens");