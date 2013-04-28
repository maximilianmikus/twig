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