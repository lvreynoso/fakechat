"use strict";

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var _socket = _interopRequireDefault(require("socket.io"));

var _chat = _interopRequireDefault(require("./sockets/chat.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// app.js
const app = (0, _express.default)();

const server = _http.default.Server(app);

app.engine('handlebars', (0, _expressHandlebars.default)());
app.set('view engine', 'handlebars'); // use public folder

app.use('/public', _express.default.static('public')); // socket.io

const io = (0, _socket.default)(server);
let onlineUsers = {};
let channels = {
  'General': []
};
io.on('connection', socket => {
  (0, _chat.default)(io, socket, onlineUsers, channels);
  console.log('🔌 New user connected! 🔌');
});
app.get('/', (req, res) => {
  res.render('index.handlebars');
});
server.listen('3000', () => {
  console.log('Server listening on Port 3000');
});
//# sourceMappingURL=app.js.map