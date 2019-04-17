// app.js

import express from 'express'
const app = express()

import http from 'http'
const server = http.Server(app)

import handlebars from 'express-handlebars'
app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
    res.render('index.handlebars')
})

server.listen('3000', () => {
    console.log('Server listening on Port 3000')
})