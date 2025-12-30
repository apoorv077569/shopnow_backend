import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./modules/auth/auth.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api/auth",authRouter);


export default app;