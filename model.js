/////////// Define Minimongo collection. //////


// Data  -- { user_id: user_id,
//        date: info[0],
//        docnr: info[1],
//        text: info[2],
//        earning: info[3],
//        spending: info[4],
//        vat: info[5],
//        catnr: info[6],
//        cat: info[7]}
Data = new Meteor.Collection("data");


// allow for logged in
Data.allow({
  insert: function (userId) {
    // user must be logged 
    return userId;
  },
  update: function (userId, data) {
    // You can only update data that you created.
    return data.user_id === userId;
  },
  remove: function (userId, data) {
    // You can only remove data that you created.
    return data.user_id === userId;
  }
});