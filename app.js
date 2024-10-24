const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send(console.log("port 123"));
});

const port = 3000;

app.listen(port, () => {
  console.log("sunucu başlatıldı.");
});
