/////////// Saving & Updating Data Helpers /////////////


var savedata = function (selector) {
  var user_id = Meteor.userId(),
      date = string_to_date($(selector + " .dt__column__input--date").val()),
      docnr = $(selector + " .dt__column__input--docnr").val(),
      text = $(selector + " .dt__column__input--text").val(),
      amount = $(selector + " .dt__column__input--amount").val(),
      isearning = $("#isearning-yes").prop("checked"),
      vat = $(selector + " .dt__column__input--vat").val(),
      cat = $(selector + " .dt__column__input--cat").val(),
      cattext = $(selector+" .dt__column__input--cat option[value='" + cat + "']").html();
      year = date.getFullYear();
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

var updatedata = function (id, selector) {
  var date = string_to_date($(selector+" .dt__column__input--date").val()),
      docnr = $(selector+" .dt__column__input--docnr").val(),
      text = $(selector+" .dt__column__input--text").val(),
      amount = $(selector+" .dt__column__input--amount").val(),
      isearning = $("#isearning-yes-" + id).prop("checked"),
      vat = $(selector+" .dt__column__input--vat").val(),
      cat = $(selector+" .dt__column__input--cat").val(),
      cattext = $(selector+" .dt__column__input--cat option[value='" + cat + "']").html();
      year = date.getFullYear();
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

Template.dt_row.date = function () {
  var date = two_digits(this.date.getDate()) + '.' + two_digits((this.date.getMonth() + 1)) + '.' + this.date.getFullYear();
  return date;
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

Template.dt_input.isearning = function () {
  return Session.equals('isearning', true);
};

Template.cat_input.isearning = Template.dt_input.isearning;

////////// datatable row Template Functions //////////////


Template.dt_row_vat.id = function () {
  return this._id;
};

Template.dt_row_amount_input.id = function () {
  return this._id;
};

////////// Initializing the page ///////////////

Template.data.rendered = function () {
  $(document).foundation();
};


//////////// Data table edit init /////////////////

Template.dt_row_vat.rendered = function () {
  var id = this.data._id,
      value = this.data.vat,
      selector = "#" + id;
  $(selector+" .dt__column__input--vat option[value='" + value + "']").prop("selected", true);
  $(document).foundation();
};

Template.dt_row_cat_input.rendered = function () {
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


// Helpers

function string_to_date(date) {
  var date_array = date.split(".");
  var new_date = new Date(date_array[2] + '-' + date_array[1] + '-' + date_array[0]);
  return new_date;
}

function two_digits(number) {
  return ("0" + number).slice(-2);
}