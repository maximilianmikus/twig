// Client-side JavaScript, bundled and sent to client.

// init session vars

Session.set('editing', null);

var dataHandle = null;


// Always be subscribed to the data for the logged in user.
Deps.autorun(function () {
  var user_id = Meteor.userId();
  if (user_id) {
    dataHandle = Meteor.subscribe('data', user_id);
  } else {
    dataHandle = null;
  }
});


/////////// Saving & Updating Data Helpers /////////////


var savedata = function(selector) {
  var user_id = Meteor.userId(),
      date = $(selector+" .dt__column__input--date").val(),
      docnr = $(selector+" .dt__column__input--docnr").val(),
      text = $(selector+" .dt__column__input--text").val(),
      earning = $(selector+" .dt__column__input--earning").val(),
      spending = $(selector+" .dt__column__input--spending").val(),
      vat = $(selector+" .dt__column__input--vat").val(),
      catnr = $(selector+" .dt__column__input--catnr").val(),
      cat = $(selector+" .dt__column__input--cat").val();
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

var updatedata = function(id, selector) {
  var date = $(selector+" .dt__column__input--date").val(),
      docnr = $(selector+" .dt__column__input--docnr").val(),
      text = $(selector+" .dt__column__input--text").val(),
      earning = $(selector+" .dt__column__input--earning").val(),
      spending = $(selector+" .dt__column__input--spending").val(),
      vat = $(selector+" .dt__column__input--vat").val(),
      catnr = $(selector+" .dt__column__input--catnr").val(),
      cat = $(selector+" .dt__column__input--cat").val();
  Data.update(id,{$set: {
                date: date,
                docnr: docnr,
                text: text,
                earning: earning,
                spending: spending,
                vat: vat,
                catnr: catnr,
                cat: cat
  }});
}


////////// Todos //////////

Template.data.loading = function () {
  return dataHandle && !dataHandle.ready();
};


Template.dt_input.events({
  // Fires when submit button is clicked
  'click #submit_new_data': function () {
    var sel = "#dt_input"
    savedata(sel);
  }
});


Template.data.data = function () {
  // Determine which data to display in main pane,
  // selected based on user_id.

  var user_id = Meteor.userId();
  if (!user_id) {
    return {};
  }
  var sel = {user_id: user_id};

  return Data.find(sel, {sort: {timestamp: 1}});
};

Template.dt_row.editing = function () {
  return Session.equals('editing', this._id);
};

Template.dt_row.id = function () {
  return this._id;
};

Template.dt_row.events({
  'click .destroy': function () {
    Data.remove(this._id);
  },
  'click .edit': function () {
    Session.set('editing', this._id);
  },
  'click .save': function () {
    var id = this._id;
    var sel = "#"+id;
    updatedata(id, sel);
    Session.set('editing', null);
  } 
});

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
