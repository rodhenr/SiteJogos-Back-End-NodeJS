import express, { Express } from "express";

const port = 8080;
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}!`);
});
