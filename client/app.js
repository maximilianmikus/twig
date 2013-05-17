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


//////////// Meteorite Router /////////////////

Meteor.Router.add({
  '': 'home',

  '/:page': function(page) {
    return page;
  },

  '*': 'not_found'
});





Meteor.startup(function () {
  var uid = Meteor.userId();
  Config.insert({
    user_id: uid,
    categories: {
      earning: [
        {id: "0001", text: "Betriebseinnahmen"},
        {id: "0002", text: "Betriebseinnahmen, keine Meldepflicht"},
        {id: "0003", text: "Anlagenerträge"},
        {id: "0004", text: "Übrige Betriebseinnahmen"}
      ],
      spending: [
        {id: "1001", text: "Waren- Roh- und Hilfsstoffe"},
        {id: "1002", text: "Beigestelltes Personal"},
        {id: "1003", text: "Personalaufwand"},
        {id: "1004", text: "AfA"},
        {id: "1005", text: "Instandhaltung f. Gebäude"},
        {id: "1006", text: "Reise-und Fahrtspäsen"},
        {id: "1007", text: "KFZ-Kosten"},
        {id: "1008", text: "Miete, Pacht, Leasing"},
        {id: "1009", text: "Provisionen, Lizenzen"},
        {id: "1010", text: "Werbeaufwändung"},
        {id: "1011", text: "Buchwert abgegangener Anlagen"},
        {id: "1012", text: "Zinsen &amp; ähnliches"},
        {id: "1013", text: "Pflichtversicherung"},
        {id: "1014", text: "Übrige Betriebsausgaben"}
      ]
    }
  });
});