var express = require("express");
var app = express();
var apicache = require("apicache");
var cache = apicache.middleware;
var axios = require("axios");
var config = {
  params: {
    APPID: "375bf1c6c475462c1304070b67e2cdc3",
  }
}

app.set("view engine", "hbs");

app.use("/axios", express.static("node_modules/axios/dist/"));

app.get("/", function(request, response){
  response.render("index.hbs", {});
});

app.get("/api/city/", function(request, response){
  var q = request.query.q;
  console.log(q);
  config["params"]["q"] = q;
  axios.get("http://api.openweathermap.org/data/2.5/weather", config)
    .then(function (result){
    console.log(result.data.main.temp);
    response.json(result.data);
  });
});
var PORT = process.env.PORT || 8000;
app.listen(PORT, function(){
  console.log("Listening on port " + PORT);
});
