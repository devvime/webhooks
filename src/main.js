const express = require("express");
const { exec } = require("child_process");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_TOKEN = process.env.SECRET_TOKEN;

const webhooks = {
  susumo: {
    action: "git -C /home/viimee/susumo/website pull"
  }
};

app.use(express.json());

app.post("/git-webhook/:name", (req, res) => {
  const token = req.headers["x-hub-token"];

  if (token !== SECRET_TOKEN) {
    console.warn("Tentativa de acesso com token inválido.");
    return res.status(403).send("Token inválido");
  }

  const hook = webhooks[req.params.name];

  if (hook) {
    exec(hook.action, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar comando: ${error.message}`);
        return res.status(500).send("Erro ao executar comando");
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      res.status(200).send("OK");
    });
  } else {
    res.status(404).send("Webhook não encontrado.");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});