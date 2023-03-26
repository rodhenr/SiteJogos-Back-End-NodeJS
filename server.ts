import express, { Express } from "express";

import cookieParser from "cookie-parser";

import cors from "cors";

import authRoutes from "./src/routes/authRoute";
import rankingRoutes from "./src/routes/rankingRoute";
import matchesRoutes from "./src/routes/matchRoute";
import userRoutes from "./src/routes/userRoute";

const port = 8080;
const app: Express = express();

app.use(cors({ credentials: true, origin: true }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(rankingRoutes);
app.use(matchesRoutes);
app.use(userRoutes);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}!`);
});
