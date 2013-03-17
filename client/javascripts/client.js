// Client-side JavaScript, bundled and sent to client.

// init session vars

Session.setDefault('editing', null);
Session.setDefault('currentPage', "home");

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

////////// Page Controller ////////////


Template.page.events = {
  'click .navlink': function (event) {
      // prevent default browser link click behaviour
      event.preventDefault();
      // get the path from the link        
      var href = $(this).attr("href");
      console.log(href);
      //var pathname = reg.exec(event.currentTarget.href)[1];
      var pathname = href
        // route the URL 
      router.navigate(pathname, true);
  }
};

////////// Main //////////

Template.main.currentPage = function (page) {
  console.log(page);
  var eq = Session.equals('currentPage', page);
  var i = 0;
  if (eq === true) {
    i = 1;
  } else {
    i = 0;
  }
  console.log(eq);
  console.log(i);
  return i;
};

////////// Data //////////

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
  'click .discard': function () {
    Session.set('editing', null);
  },
  'click .save': function () {
    var id = this._id;
    var sel = "#"+id;
    updatedata(id, sel);
    Session.set('editing', null);
  } 
});

////////// Tracking selected list in URL //////////

var ContentRouter = Backbone.Router.extend({
  routes: {
    "": "home",
    ":page": "page"
  },
  page: function (page) {
    console.log(page);
    Session.set('currentPage', page);
  }
});

var router = new ContentRouter;

router.on('route:page', function (page) {
  console.log("setting session -> "+page);
  Session.set('currentPage', page);
});

Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});


/////////// Prevent Default ///////////////////
/*
$(document).ready(function() {
  $(".navlink").click(function(e) {
    e.preventDefault();
    var href = $(this).attr("href");
    console.log("navigate -> "+href);
    router.navigate(href);
  });
});
*/