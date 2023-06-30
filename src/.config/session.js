const session = require("express-session");

const SessionAuth = new session({
    name: "BOT",
    secret: process.env.SECRET_BOT_SESSION,
    cookie: {
      sameSite: "lax",
    },
    resave: false,
    saveUninitialized: true,
  })

module.exports = {SessionAuth}