// Client-side JavaScript, bundled and sent to client.

// Define Minimongo collections to match server/publish.js.
Data = new Meteor.Collection("data");
/*
// ID of currently selected list
Session.setDefault('user_id', null);

// Name of currently selected tag for filtering
Session.setDefault('tag_filter', null);

// When adding tag to a todo, ID of the todo
Session.setDefault('editing_addtag', null);

// When editing a list name, ID of the list
Session.setDefault('editing_listname', null);

// When editing todo text, ID of the todo
Session.setDefault('editing_itemname', null);
*/
/*
// Subscribe to 'lists' collection on startup.
// Select a list once data has arrived.
var listsHandle = Meteor.subscribe('lists', function () {
  if (!Session.get('list_id')) {
    var list = Lists.findOne({}, {sort: {name: 1}});
    if (list)
      Router.setList(list._id);
  }
});
*/
var dataHandle = null;

console.log("user_id: "+Meteor.userId());

// Always be subscribed to the todos for the selected list.
Deps.autorun(function () {
  var user_id = Meteor.userId();
  if (user_id) {
    dataHandle = Meteor.subscribe('data', user_id);
  } else {
    dataHandle = null;
  }
});


////////// Helpers for in-place editing //////////
/*
// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13 ||
                 evt.type === "focusout") {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };

  return events;
};

var activateInput = function (input) {
  input.focus();
  input.select();
};
*/
/////////// Saving Data Helper /////////////


var savedata = function(selector) {
  var user_id = Meteor.userId();
  var date = $("#date").val();
  var docnr = $("#docnr").val();
  var text = $("#text").val();
  var earning = $("#earning").val();
  var spending = $("#spending").val();
  var vat = $("#vat").val();
  var catnr = $("#catnr").val();
  var cat = $("#cat").val();
  Data.insert({
                user_id: user_id,
                date: date,
                docnr: docnr,
                text: text,
                earning: earning,
                spending: spending,
                vat: vat,
                catnr: catnr,
                cat: cat
  });
}


////////// Todos //////////

Template.data.loading = function () {
  return dataHandle && !dataHandle.ready();
};


Template.data.events({
  // Fires when submit button is clicked
  'click #submit_new_data': function (event) { 
    savedata();
  }
});

Template.data.data = function () {
  // Determine which todos to display in main pane,
  // selected based on list_id and tag_filter.

  var user_id = Meteor.userId();
  if (!user_id) {
    return {};
  }
  var sel = {user_id: user_id};

  return Data.find(sel, {sort: {timestamp: 1}});
};

////////// Tracking selected list in URL //////////

var TodosRouter = Backbone.Router.extend({
  routes: {
    ":user_id": "main"
  },
  main: function (list_id) {
    var oldList = Session.get("list_id");
    if (oldList !== list_id) {
      Session.set("list_id", list_id);
      Session.set("tag_filter", null);
    }
  },
  setList: function (list_id) {
    this.navigate(list_id, true);
  }
});

Router = new TodosRouter;

Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});
