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
    var month = this.date.getMonth();
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


Template.overview.rendered = function() {
  var year = Session.get('year');
  initcharts(year);
};


// inits 
// not working
// initcharts(Session.get('year'));