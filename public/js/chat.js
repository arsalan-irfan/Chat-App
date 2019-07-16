//var moment = require('moment');

var socket = io();
	var params = jQuery.deparam(window.location.search);

	function scrollToBottom(){
		 //Selectors
		 	var messages = jQuery('#messages');
		 	var newMessage = messages.children('li:last-child');
		 //Heightsvar
		 	var clientHeight = messages.prop('clientHeight')
		 	var scrollTop = messages.prop('scrollTop')
		 	var scrollHeight = messages.prop('scrollHeight') 
		 	var newMessageHeight = newMessage.innerHeight();
		 	var lastMessageHeight = newMessage.prev().innerHeight();

		if(scrollTop + clientHeight +newMessageHeight + lastMessageHeight>= scrollHeight)
		{
			messages.scrollTop(scrollHeight);
		}
	}
		socket.on('connect', () => {
			console.log('Connected to server');
			socket.emit('join',params, function(error){
				if(error)
				{
					alert(error)
					window.location.href = "../"
				}
				else
				{
					alert()
				}
			});
		});
		socket.on('disconnect', () => {
			console.log("disconnected from server")
		});

        socket.on('updateUserList', function(users) {
        	var ol = jQuery('<ol></ol>');
        	users.forEach(function(user){
        		ol.append(jQuery('<li></li>').text(user))
        	})
        	jQuery('#users').html(ol)
			console.log("Users ",users)
     	});

		 socket.on("newMessage", function(msg) {
			var temp = jQuery("#message-template").html();
			var formattedTime = moment(msg.createdAt).format("h:mm a");
			var html = Mustache.render(temp, {
				text:msg.text,
				from:msg.from,
				time: formattedTime
			});
			jQuery('#messages').append(html)
			scrollToBottom()
			// console.log(msg);
		
			// var li = jQuery('<li></li>');
			// li.text(`${msg.from} ${formattedTime}: ${msg.text} `);
			// jQuery('#messages').append(li);
		});

		jQuery("#form").on('submit', function(e){
			e.preventDefault();
			var messageTextBox = jQuery('[name="message"]');
			if(!messageTextBox.val().trim() == "")
		{	socket.emit('createMessage',{
				from:params.name,
				text:messageTextBox.val()}
			,function(){   
				messageTextBox.val('');
			}) }
		}); 
//});   