const express = require("express");
const { exec } = require("child_process");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_TOKEN = process.env.SECRET_TOKEN;

const webhooks = {
  webhook1: {
    action: "git -C /home/user/project pull"
  }
};

app.use(express.json());

app.post("/git-webhook/:name", (req, res) => {
  const token = req.headers["x-hub-token"];

  if (token !== SECRET_TOKEN) {
    console.warn("Attempted access with invalid token.");
    return res.status(403).send("Invalid token");
  }

  const hook = webhooks[req.params.name];

  if (hook) {
    exec(hook.action, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return res.status(500).send("Error executing command");
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      res.status(200).send("OK");
    });
  } else {
    res.status(404).send("Webhook not found.");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});