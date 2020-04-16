

const { checkUsernamePassword } = require("./firebaseDefinition");
const PORT = process.env.PORT || 3005;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Website you wish to allow to connect need to add here the github root to the website !!!
app.use(function (req, res, next) {
  const allowedOrigins = [
    "http://localhost:3000"//,"github"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.post('/loginRequest', (req, res) => {
  const userDetails = req.body;
  checkUsernamePassword(userDetails).then((response) => {
    if (response === null) {
      res.status("404").send("Login Error");
      return;
    }
    res.send(response);
  });
});

app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`)
);