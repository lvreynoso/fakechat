// chat.js

const chat = function(io, socket, onlineUsers) {
    // Listen for new users
    socket.on('new user', (username) => {
        onlineUsers[username] = socket.id
        socket['username'] = username
        console.log(`${username} has joined the chat! ✋`)
        io.emit('new user', username)
    })

    // Listen for new messages
    socket.on('new message', (data) => {
        // Send that data back to ALL clients
        console.log(`🎤 ${data.sender}: ${data.message} 🎤`)
        io.emit('new message', data);
    })

    socket.on('get online users', () => {
        // send online users
        socket.emit('get online users', onlineUsers)
    })

    socket.on('new channel', (newChannel) => {
        console.log(newChannel)
    })

    socket.on('disconnect', () => {
        delete onlineUsers[socket.username]
        io.emit('user has left', onlineUsers)
    })
}

export default chat