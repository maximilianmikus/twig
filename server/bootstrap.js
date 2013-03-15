// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Data.find().count() === 0) {
    console.log("bing");
    var data = [
      {user_id: "test",
       contents: [
         ["01.02.2013", "b12", "Menkisys Server", "", "-47,00", "20", "420", "Infrastruktur"],
         ["01.02.2013", "b12", "Menkisys Server", "", "-47,00", "20", "420", "Infrastruktur"],
         ["01.02.2013", "b12", "Menkisys Server", "", "-47,00", "20", "420", "Infrastruktur"],
         ["01.02.2013", "b12", "Menkisys Server", "", "-47,00", "20", "420", "Infrastruktur"],
         ["01.02.2013", "b12", "Menkisys Server", "", "-47,00", "20", "420", "Infrastruktur"]
       ]
      }
    ];

    for (var i = 0; i < data.length; i++) {
      var user_id = data[i].userid;
      for (var j = 0; j < data[i].contents.length; j++) {
        var info = data[i].contents[j];
        Data.insert({ user_id: user_id,
                      date: info[0],
                      docnr: info[1],
                      text: info[2],
                      earning: info[3],
                      spending: info[4],
                      vat: info[5],
                      catnr: info[6],
                      cat: info[7]
                    });
      }
    }
  }
});
