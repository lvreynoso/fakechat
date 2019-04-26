// connect to the socket.io server
const socket = io.connect()

window.onload = function () {

    var currentUser = ''
    var currentChannel = 'General'

    socket.emit('get online users')
    socket.emit('user changed channel', 'General')

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
                channel: currentChannel
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

    document.getElementById('General').addEventListener('click', channelChange)

    Array.prototype.forEach( (channel) => {
        channel.addEventListener('click', channelChange)
    }, document.getElementsByClassName('channel'))

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
        console.log(data)
        if (currentChannel != data.channel) {
            return
        }
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

    // update channel list with a new channel
    socket.on('new channel', (newChannel) => {
        let channelNode = document.createElement('div')
        channelNode.className = 'channel'
        channelNode.textContent = `${newChannel}`
        channelNode.id = `${newChannel}`
        document.getElementById('channels').appendChild(channelNode)
        channelNode.addEventListener('click', channelChange)
    })

    socket.on('user changed channel', (data) => {
        let currentChannelNode = document.getElementById(currentChannel)
        currentChannelNode.classList.add('channel')
        currentChannelNode.classList.remove('channel-current')
        
        let selectedChannelNode = document.getElementById(data.channel)
        selectedChannelNode.classList.add('channel-current')
        selectedChannelNode.classList.remove('channel')
        
        let messageContainer = document.getElementById('messageContainer')
        while (messageContainer.firstChild) {
            messageContainer.removeChild(messageContainer.firstChild)
        }
        data.messages.forEach( (message) => {
            let senderNode = document.createElement('p')
            senderNode.className = 'messageUser'
            senderNode.textContent = `${message.sender}: `

            let messageNode = document.createElement('p')
            messageNode.className = 'messageText'
            messageNode.textContent = `${message.message}`

            let containerNode = document.createElement('div')
            containerNode.className = 'message'
            containerNode.appendChild(senderNode)
            containerNode.appendChild(messageNode)

            messageContainer.appendChild(containerNode)
        })

        currentChannel = data.channel
    })
}

function channelChange (event) {
    let newChannel = event.target.textContent
    socket.emit('user changed channel', newChannel)
}