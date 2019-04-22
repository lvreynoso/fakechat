// app.js

import express from 'express'
const app = express()

import http from 'http'
const server = http.Server(app)

import handlebars from 'express-handlebars'
app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')

// use public folder
app.use('/public', express.static('public'))

// socket.io
import socketIO from 'socket.io'
import chat from './sockets/chat.js'
const io = socketIO(server)
let onlineUsers = {}
let channels = { 'General': [] }
io.on('connection', (socket) => {
    chat(io, socket, onlineUsers, channels)
    console.log('🔌 New user connected! 🔌')
})

app.get('/', (req, res) => {
    res.render('index.handlebars')
})

server.listen('3000', () => {
    console.log('Server listening on Port 3000')
})