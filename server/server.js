

// Publish complete set of lists to all clients.
Meteor.publish('data', function (user_id) {
  return Data.find({user_id: user_id});
});
