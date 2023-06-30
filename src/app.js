const express = require('express')
const path = require('path')
const swaggerOption = require('./.config/swagger')
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const specs = swaggerJsDoc(swaggerOption);
const errorHandler = require('./middelware/errorHandling')
const routerNav = require("./router/nav")
const routerApiBot = require("./router/apibot")

const app = new express()

app.set("view engine", "hbs");
app.use(require('cors')())
app.use(require('morgan')('dev'))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))

//app.use("/apibot/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', routerNav) 
app.use('/apibot', routerApiBot)

// Обработка ошибок, последний Middelware
app.use(errorHandler)

module.exports = app