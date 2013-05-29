//////////// Header ///////////////

Template.main_menu.is_active = function(page) {
  if(Session.equals("active-page", page)) {
    return "active";
  } else {
    return "inactive";
  }
};

Template.yearsel.events({
  // listen to select changes for current year
  'change .yearsel__select': function () {
    var sel_year = $(".yearsel__select").val();
    Session.set('year', sel_year);
    initcharts(sel_year);
  }
});

Template.total.balance = function(page) {
  var balance = Session.get("total");
  balance += ' €';
  return balance;
};