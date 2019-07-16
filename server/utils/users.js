// [{
// 	id:"",
// 	name:""
// 	room:""
// }]

class Users{
	constructor (){
		this.users = [];
	}

	addUser(id,name,room){
		var user = {
			id,name,room
		}
		this.users.push(user)
		return user;
	}

	removeUser(id){
		var user = this.getUser(id);
		console.log(user)
		if(user){
			this.users = this.users.filter( (user) => user.id !== id)
		} 
		return user;
	}

	getUser(id){
		var user = this.users.filter( (user) => user.id === id)[0];
		return user;
	}

	getUserList(room){
		var users = this.users.filter( (user) => user.room === room)
		var names = users.map( (user) => user.name);
		console.log("names",names);
		return names;
	}
	checkName(name,room){
		console.log("Hmm ",this.users);
		var user = this.users.filter((user)=> {
			return (user.room == room && user.name == name)
		});
		console.log("Users hain ye",user)
		return user.length;
	}
}

module.exports = {Users}

