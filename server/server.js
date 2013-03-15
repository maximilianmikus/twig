// Data  -- {	user_id: user_id,
//				date: info[0],
//				docnr: info[1],
//				text: info[2],
//				earning: info[3],
//				spending: info[4],
//				vat: info[5],
//				catnr: info[6],
//				cat: info[7]}
Data = new Meteor.Collection("data");

// Publish complete set of lists to all clients.
Meteor.publish('data', function (user_id) {
  return Data.find({user_id: user_id});
});

/*
// Todos -- {text: String,
//           done: Boolean,
//           tags: [String, ...],
//           list_id: String,
//           timestamp: Number}
Todos = new Meteor.Collection("todos");

// Publish all items for requested list_id.
Meteor.publish('todos', function (list_id) {
  return Todos.find({list_id: list_id});
});

*/