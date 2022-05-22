const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const request = require('request');

const app = express();
const port = process.env.PORT || 8081;

const population_levels_API = require("./src/back/population-levels/v2/API population-levels.js");
const population_levels_API_v1 = require("./src/back/population-levels/v1/API population-levels.js");
const energy_consumptions_API = require("./src/back/energy-consumptions/v2/energy-consumptions.js");
const energy_consumptions_API_v1 = require("./src/back/energy-consumptions/v1/energy-consumptions.js");
const internet_population_API = require("./src/back/internet-population/v2/internet-population.js");
const Datastore = require('nedb');

//BASE DE DATOS

db_population_levels = new Datastore();
db_population_levels_v1 = new Datastore();
db_internet_population = new Datastore();
db_energy_consumptions = new Datastore();
db_energy_consumptions_v1 = new Datastore();

app.use(bodyParser.json());
app.use(cors());

//PROXYs

//Para Alejandro Molinos Eligio
var paths='/remoteApiRegistration';
var apiServerHost = 'https://sos2122-31.herokuapp.com/api/v2/registration-stats';

app.use(paths, function(req, res) {
  var url = apiServerHost + req.url;
  req.pipe(request(url)).pipe(res);
});

//Para Gabriel López Bellido
var paths2='/remoteApiCo2';
var apiServerHost2 = 'https://sos2122-22.herokuapp.com/api/v2/co2-stats';

app.use(paths2, function(req, res) {
  var url = apiServerHost2 + req.url;
  req.pipe(request(url)).pipe(res);
});




// SERVER APIs

population_levels_API.register(app,db_population_levels);
population_levels_API_v1.register(app,db_population_levels_v1);
energy_consumptions_API.register(app, db_energy_consumptions);
energy_consumptions_API_v1.register(app, db_energy_consumptions_v1);
internet_population_API.register(app, db_internet_population);

app.use("/", express.static('public'));

app.get("/cool",(req,res)=>{
    console.log("Requested / route");
    res.send("<html><body>"+cool()+"</body></html>");
});


app.listen(port, () => {
    console.log(`Servidor listo ${port}`)
});

