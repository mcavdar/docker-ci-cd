import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.json({ message: "Hello from Docker!" });
});

app.get("/health", (_, res) => {
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Listening on 3000");
});
