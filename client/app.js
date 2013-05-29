// Client-side JavaScript, bundled and sent to client.

// init session vars

Session.setDefault('editing', null);
Session.setDefault('currentPage', "home");
Session.setDefault('isearning', true);
Session.setDefault('year', 2013);

var dataHandle = null;


// Always be subscribed to the data for the logged in user.
Deps.autorun(function () {
  var user_id = Meteor.userId();
  if (user_id) {
    dataHandle = Meteor.subscribe('data', user_id);
    configHandle = Meteor.subscribe('config', user_id);
  } else {
    dataHandle = null;
    configHandle = null;
  }
});

Deps.autorun(updatetotal);

//////////// Meteorite Router /////////////////

Meteor.Router.add({
  '': 'home',

  '/:page': function(page) {
    Session.set('active-page', page);
    return page;
  },

  '*': 'not_found'
});

Handlebars.registerHelper("loggedin", function() {
  if (Meteor.userId()) {
    return true;
  } else {
    return false;
  }
});