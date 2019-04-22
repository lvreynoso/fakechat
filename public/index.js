window.onload = function () {
    // connect to the socket.io server
    const socket = io.connect()

    let currentUser = ''

    socket.emit('get online users')

    document.getElementById('createUserBtn').addEventListener('click', (event) => {
        event.preventDefault()
        const username = document.getElementById('usernameInput').value
        if (username.length > 0) {
            // emit to the server the new user
            socket.emit('new user', username)
            currentUser = username
            document.getElementById('usernameForm').remove()
            document.getElementById('mainContainer').style.display = 'flex' 
        }
    })

    document.getElementById('sendChatBtn').addEventListener('click', (event) => {
        event.preventDefault()
        const message = document.getElementById('chatInput').value
        if (message.length > 0) {
            socket.emit('new message', {
                sender: currentUser,
                message: message,
            })
            document.getElementById('chatInput').value = ''
        }
    })

    document.getElementById('newChannelBtn').addEventListener('click', (event) => {
        let newChannel = document.getElementById('newChannelInput').value 
        if (newChannel.length > 0) {
            socket.emit('new channel', newChannel)
            document.getElementById('newChannelInput').value = ''
        }
    })

    socket.on('get online users', (onlineUsers) => {
        for (username in onlineUsers) {
            let newUserDiv = document.createElement('div')
            newUserDiv.className = 'userOnline'
            newUserDiv.textContent = `${username}`
            document.getElementById('usersOnline').appendChild(newUserDiv)
        }
    })

    socket.on('user has left', (onlineUsers) => {
        let userlist = document.getElementById('usersOnline')
        while (userlist.firstChild) {
            userlist.removeChild(userlist.firstChild)
        }
        for (username in onlineUsers) {
            let newUserDiv = document.createElement('div')
            newUserDiv.className = 'userOnline'
            newUserDiv.textContent = `${username}`
            document.getElementById('usersOnline').appendChild(newUserDiv)
        }
    })

    socket.on('new user', (username) => {
        console.log(`✋ ${username} has joined the chat! ✋`)
        let newUserDiv = document.createElement('div')
        newUserDiv.className = 'userOnline'
        newUserDiv.textContent = `${username}`
        document.getElementById('usersOnline').appendChild(newUserDiv)
    })

    socket.on('new message', (data) => {
        let senderNode = document.createElement('p')
        senderNode.className = 'messageUser'
        senderNode.textContent = `${data.sender}: `

        let messageNode = document.createElement('p')
        messageNode.className = 'messageText'
        messageNode.textContent = `${data.message}`

        let containerNode = document.createElement('div')
        containerNode.className = 'message'
        containerNode.appendChild(senderNode)
        containerNode.appendChild(messageNode)

        document.getElementById('messageContainer').appendChild(containerNode)
    })
}