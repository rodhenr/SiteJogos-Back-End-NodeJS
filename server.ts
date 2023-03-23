import express, { Express } from "express";

import cookieParser from "cookie-parser";

import cors from "cors";

import authRoutes from "./src/routes/AuthRoute";
import generalInfoRoutes from "./src/routes/GeneralInfoRoute";
import userInfoRoutes from "./src/routes/UserInfoRoute";

const port = 8080;
const app: Express = express();

app.use(cors({ credentials: true, origin: true }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(generalInfoRoutes);
app.use(userInfoRoutes);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}!`);
});
