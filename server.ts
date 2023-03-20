import express, { Express } from "express";

import authRoutes from "./src/routes/AuthRoute";
import infoRoutes from "./src/routes/InfoController";

const port = 8080;
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(infoRoutes);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}!`);
});
