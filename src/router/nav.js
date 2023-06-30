const Router = require('express')
const controllerNav = require('../controller/nav')
const routes = new Router() 

// localhost:5000/
routes.get('/', controllerNav.viewIndex)

module.exports = routes 