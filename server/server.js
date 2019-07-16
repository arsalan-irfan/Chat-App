var path = require('path');
var express = require('express');
var socketIO = require('socket.io');
var http = require('http');

var {isRealString} = require('./utils/validation')
var {generateMessage} = require("./utils/message.js")
var {Users} = require('./utils/users.js')
var publicPath = path.join(__dirname,"../public")
var port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server)
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {

	socket.on('join', (params,callback) => {
		if(!isRealString(params.name) || !isRealString(params.room))
		{
			return callback("Name and room name are required")
		}
		var flag = users.checkName(params.name,params.room);
		if(flag === 0)
        {
            console.log("New User")
			users.removeUser(socket.id);
			users.addUser(socket.id,params.name,params.room);
			socket.join(params.room);		
		    socket.emit('newMessage', generateMessage("Admin","Welcome to the chat app"));
	        socket.broadcast.to(params.room).emit('newMessage',generateMessage("Admin",` ${params.name} Joined Chat`));
	        io.to(params.room).emit('updateUserList', users.getUserList(params.room)) 
	    }
	    else    
		{
	     callback("User is Already in the Chat Room")
		}	
	})




	socket.on('createMessage', (msg,callback) => {
		var user = users.getUser(socket.id);
		io.to(user.room).emit('newMessage', generateMessage(msg.from,msg.text));
		callback();
	});

	socket.on('disconnect', ()=> {
		var user = users.removeUser(socket.id);
		if(user)
		{	
			io.to(user.room).emit('updateUserList',users.getUserList(user.room))
		    io.to(user.room).emit('newMessage',generateMessage("Admin",`${user.name} left`))
		}	
	})

	// socket.emit('newMessage',{
	// 	to:"ahmed@hotmail.com",
	// 	text:"Hello from server"
	// })
});

server.listen(port, ()=> {

	console.log("Server is up on port ",port);
});