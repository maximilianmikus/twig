// Client-side JavaScript, bundled and sent to client.

// init session vars

Session.setDefault('editing', null);
Session.setDefault('currentPage', "home");
Session.setDefault('isearning', true);
Session.setDefault('year', 13);

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
      date = $(selector + " .dt__column__input--date").val(),
      docnr = $(selector + " .dt__column__input--docnr").val(),
      text = $(selector + " .dt__column__input--text").val(),
      amount = $(selector + " .dt__column__input--amount").val(),
      isearning = $("#isearning-yes").prop("checked"),
      vat = $(selector + " .dt__column__input--vat").val(),
      cat = $(selector + " .dt__column__input--cat").val(),
      cattext = $(selector+" .dt__column__input--cat option[value='" + cat + "']").html();
      year = parseYear(date);
  Data.insert({
                user_id: user_id,
                date: date,
                year: year,
                docnr: docnr,
                text: text,
                amount: amount,
                isearning: isearning,
                vat: vat,
                cat: cat,
                cattext: cattext
  });
};

var updatedata = function(id, selector) {
  var date = $(selector+" .dt__column__input--date").val(),
      docnr = $(selector+" .dt__column__input--docnr").val(),
      text = $(selector+" .dt__column__input--text").val(),
      amount = $(selector+" .dt__column__input--amount").val(),
      isearning = $("#isearning-yes-" + id).prop("checked"),
      vat = $(selector+" .dt__column__input--vat").val(),
      cat = $(selector+" .dt__column__input--cat").val(),
      cattext = $(selector+" .dt__column__input--cat option[value='" + cat + "']").html();
      year = parseYear(date);
  Data.update(id,{$set: {
                date: date,
                year: year,
                docnr: docnr,
                text: text,
                amount: amount,
                isearning: isearning,
                vat: vat,
                cat: cat,
                cattext: cattext
  }});
};
//////////// Header ///////////////

Template.yearsel.rendered = function() {
  $(document).foundation();
};

Template.yearsel.events({
  // listen to select changes for current year
  'change .yearsel__select': function () {
    var sel_year = $(".yearsel__select").val();
    Session.set('year', sel_year);
    initcharts(sel_year);
  }
});


////////// Data //////////

Template.data.loading = function () {
  return dataHandle && !dataHandle.ready();
};

Template.dt_input.events({
  // Fires when submit button is clicked
  'click #submit_new_data': function () {
    var sel = "#dt_input";
    savedata(sel);
  },
  'click .switch-input': function () {
    var isearning = $("#isearning-yes").prop("checked");
    Session.set("isearning", isearning);
  }
});


Template.data.data = function () {
  // Determine which data to display in main pane,
  // selected based on user_id.

  var user_id = Meteor.userId();
  if (!user_id) {
    return {};
  }
  //var sel = {user_id: user_id};
  var sel = {year: parseInt(Session.get('year'), 10)};

  return Data.find(sel, {sort: {date: 1}});
};

////////// row editing Template Funtions //////////////

Template.dt_row.editing = function () {
  return Session.equals('editing', this._id);
};

Template.dt_row.id = function () {
  return this._id;
};

Template.dt_row.isearning = function () {
  return this.isearning;
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

////////// cat entry Template Funtions //////////////



Template.cat_input.isearning = function () {
  if (this._id) {
    //console.log(this._id);
  } else {
    return Session.equals('isearning', true);
  }
};

////////// datatable row Template Functions //////////////


Template.dt_row_vat.id = function () {
  return this._id;
};

Template.dt_row_amount_input.id = function () {
  return this._id;
};

//////////// Meteorite Router /////////////////

Meteor.Router.add({
  '': 'home',

  '/:page': function(page) {
    return page;
  },

  '*': 'not_found'
});



////////// Initializing the page ///////////////

Template.data.rendered = function() {
  $(document).foundation();
};


//////////// Data table edit init /////////////////

Template.dt_row_vat.rendered = function() {
  var id = this.data._id,
      value = this.data.vat,
      selector = "#" + id;
  $(selector+" .dt__column__input--vat option[value='" + value + "']").prop("selected", true);
  $(document).foundation();
};

Template.dt_row_cat_input.rendered = function() {
  var id = this.data._id,
      value = this.data.cat,
      selector = "#" + id;
  $(selector+" .dt__column__input--cat option").removeAttr("selected");
  $(selector+" .dt__column__input--cat option[value='" + value + "']").attr("selected", true);
  $(selector+" .dt__column__input--cat option[value='" + value + "']").addClass("selected");
  // @todo: get dropdowns working
  $(document).foundation('dropdown', function (response) {
    //console.log("ding");
  });
};


///////////////// Overview //////////////////////////

function initcharts(year) {
  // Build Chart Data
  var dataItems = Data.find({year: parseInt(year, 10)});
  var arr = dataItems.fetch();
  var data = {
    labels : ["Jan","Feb","Mar","Apr","May","Jun","Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    datasets : [
      {
        fillColor : "rgba(154,205,50,0.7)",
        strokeColor : "rgba(154,205,50,1)",
        pointColor : "rgba(154,205,50,1)",
        pointStrokeColor : "#fff",
        data : []
      },
      {
        fillColor : "rgba(255,69,0,0.0)",
        strokeColor : "rgba(255,69,0,1)",
        pointColor : "rgba(255,69,0,1)",
        pointStrokeColor : "#fff",
        data : []
      },
      {
        fillColor : "rgba(151,187,205,0.0)",
        strokeColor : "rgba(151,187,205,0.8)",
        pointColor : "rgba(151,187,205,1)",
        pointStrokeColor : "#fff",
        data : []
      }
    ]
  };
  // init data arrays
  var spending = [0,0,0,0,0,0,0,0,0,0,0,0];
  var earning = [0,0,0,0,0,0,0,0,0,0,0,0];
  var balance = [0,0,0,0,0,0,0,0,0,0,0,0];
  // build earning & spending arrays
  $.each(arr, function() {
    var amount = parseFloat(this.amount.replace(",", "."));
    var month = parseMonth(this.date);
    var earning_month = earning[month];
    var spending_month = spending[month];
    if (this.isearning) {
      earning[month] = earning_month+amount;
    } else {
      spending[month] = spending_month+amount;
    }
  });
  // substract spending from earning to get balance

  for (var i=0; i < 11; i++) {
    balance[i] = earning[i] - spending[i];
  }

  data.datasets[0].data = balance;
  data.datasets[1].data = spending;
  data.datasets[2].data = earning;

  var ctx = document.getElementById("finance-chart").getContext("2d");
  var myNewChart = new Chart(ctx).Line(data);
}

function parseMonth(date) {
  var partials = date.match(/[0-9][0-9]/g);
  var month = parseInt(partials[1], 10);
  return month;
}

function parseYear(date) {
  var partials = date.match(/[0-9][0-9]/g);
  var year = parseInt(partials[3], 10);
  return year;
}


Template.overview.rendered = function() {
  var year = Session.get('year');
  initcharts(year);
};


// inits 
// not working
// initcharts(Session.get('year'));