window.onload = function () {
    // connect to the socket.io server
    const socket = io.connect()

    document.getElementById('createUserBtn').addEventListener('click', (event) => {
        console.log('button clicked')
        event.preventDefault()
        const username = document.getElementById('usernameInput').value
        if (username.length > 0) {
            // emit to the server the new user
            socket.emit('new user', username)
            document.getElementById('usernameForm').remove()
        }
    })

    socket.on('new user', (username) => {
        console.log(`✋ ${username} has joined the chat! ✋`)
    })
}