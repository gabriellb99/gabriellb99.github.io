const bodyParser = require("body-parser");

const BASE_API_URL_ENERGY_CONSUMPTIONS = "/api/v2/energy-consumptions";

//API Gabriel López Bellido

var energy_consumptions = [
    {
        country: "belgium",
        year: 2014,
        percentages_access_elecetricity: 100,
        non_renewable_energy_consumptions: 90.88,
        renewable_energy_consumptions: 9.12
    },
    {
        country: "italy",
        year: 2005,
        percentages_access_elecetricity: 100,
        non_renewable_energy_consumptions: 93.3,
        renewable_energy_consumptions: 6.7
    },
    {
        country: "brazil",
        year: 2014,
        percentages_access_elecetricity: 99.7,
        non_renewable_energy_consumptions: 58.13,
        renewable_energy_consumptions: 41.83
    },
    {
        country: "belgium",
        year: 2013,
        percentages_access_elecetricity: 100,
        non_renewable_energy_consumptions: 91.91,
        renewable_energy_consumptions: 8.09
    },
    {
        country: "brazil",
        year: 2013,
        percentages_access_elecetricity: 99.6,
        non_renewable_energy_consumptions: 57.57,
        renewable_energy_consumptions: 42.43
    }
    ,{
        country: "serbia",
        year: 2013,
        percentages_access_elecetricity: 99.92,
        non_renewable_energy_consumptions: 79.81,
        renewable_energy_consumptions: 20.19
    }
    , {
        country: "croatia",
        year: 2014,
        percentages_access_elecetricity: 100,
        non_renewable_energy_consumptions: 66.38,
        renewable_energy_consumptions: 33.62
    }
    , {
        country: "nicaragua",
        year: 2003,
        percentages_access_elecetricity: 74.5,
        non_renewable_energy_consumptions: 48.26,
        renewable_energy_consumptions: 51.74
    }
    , {
        country: "nicaragua",
        year: 2010,
        percentages_access_elecetricity: 78.2,
        non_renewable_energy_consumptions: 45.56,
        renewable_energy_consumptions: 54.44
    }
    , {
        country: "nicaragua",
        year: 2007,
        percentages_access_elecetricity: 76.56,
        non_renewable_energy_consumptions: 45.44,
        renewable_energy_consumptions: 54.56
    }
    , {
        country: "czech republic",
        year: 2011,
        percentages_access_elecetricity: 100,
        non_renewable_energy_consumptions: 87.84,
        renewable_energy_consumptions: 12.16	

    }
    , {
        country: "japan",
        year: 2013,
        percentages_access_elecetricity: 100,
        non_renewable_energy_consumptions: 94.84,
        renewable_energy_consumptions: 5.16
    }
    , {
        country: "ecuador",
        year: 2009,
        percentages_access_elecetricity: 96.47,
        non_renewable_energy_consumptions: 87.13,
        renewable_energy_consumptions: 12.87
    }
    , {
        country: "nigeria",
        year: 2012,
        percentages_access_elecetricity: 53.15,
        non_renewable_energy_consumptions: 15.4,
        renewable_energy_consumptions: 84.60
    }
    , {
        country: "sudan",
        year: 2012,
        percentages_access_elecetricity: 41.60,
        non_renewable_energy_consumptions: 36.24,
        renewable_energy_consumptions: 63.76
    }
    , {
        country: "bahrain",
        year: 2013,
        percentages_access_elecetricity: 100,
        non_renewable_energy_consumptions: 100,
        renewable_energy_consumptions: 0
    }
    , {
        country: "uruaguay",
        year: 2010,
        percentages_access_elecetricity: 99.30,
        non_renewable_energy_consumptions: 46.77,
        renewable_energy_consumptions: 53.23
    }
    , {
        country: "romania",
        year: 2010,
        percentages_access_elecetricity: 100,
        non_renewable_energy_consumptions: 75.90,
        renewable_energy_consumptions: 24.10
    }
    , {
        country: "greece",
        year: 2012,
        percentages_access_elecetricity: 100,
        non_renewable_energy_consumptions: 85.83,
        renewable_energy_consumptions: 14.17
    }
    , {
        country: "peru",
        year: 2011,
        percentages_access_elecetricity: 89.71,
        non_renewable_energy_consumptions: 69.37,
        renewable_energy_consumptions: 30.63
    }
    , {
        country: "ecuador",
        year: 2008,
        percentages_access_elecetricity: 97.21,
        non_renewable_energy_consumptions: 84.68,
        renewable_energy_consumptions: 15.32
    }
    , {
        country: "spain",
        year: 2012,
        percentages_access_elecetricity: 100,
        non_renewable_energy_consumptions: 84.20,
        renewable_energy_consumptions: 15.80
    }
]

/*
API para Energy-Consumptions
*/

//Cargar datos iniciales

module.exports.register = (app, db) => {

    app.get(BASE_API_URL_ENERGY_CONSUMPTIONS + "/loadInitialData", (req, res) => {

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }
            if (filteredList == 0) {
                for (var i = 0; i < energy_consumptions.length; i++) {
                    db.insert(energy_consumptions[i]);
                }
                res.sendStatus(200, "OK.");
                return;
            }else{
            res.sendStatus(200, "Ya inicializados")
        }
        });
    })

    // Documentos

    app.get(BASE_API_URL_ENERGY_CONSUMPTIONS + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/19576654/UVyswasj")
    })

    // GET global y GET por año

    app.get(BASE_API_URL_ENERGY_CONSUMPTIONS, (req, res) => {

        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for (var i = 0; i < Object.keys(req.query).length; i++) {
            var element = Object.keys(req.query)[i];
            if (element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset") {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        //Comprobamos si from es mas pequeño o igual a to

        if (from > to) {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        db.find({}, function (err, filteredList) {

            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }


            // Apartado para búsqueda por año

            if (year != null) {
                var filteredList = filteredList.filter((reg) => {
                    return (reg.year == year);
                });
                if (filteredList == 0) {
                    res.sendStatus(404, "NO EXISTE");
                    return;
                }
            }

            // Apartado para from y to

            if (from != null && to != null) {
                filteredList = filteredList.filter((reg) => {
                    return (reg.year >= from && reg.year <= to);
                });

                if (filteredList == 0) {
                    res.sendStatus(404, "NO EXISTE");
                    return;
                }
            }

            // Resultado sin ID

            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = paginacion(req, filteredList);
            }
            filteredList.forEach((element) => {
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "percentages_access_elecetricity"  && element != "non_renewable_energy_consumptions" && element != "renewable_energy_consumptions"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }
            res.send(JSON.stringify(filteredList, null, 2));
        })
    })

    // GET por país

    app.get(BASE_API_URL_ENERGY_CONSUMPTIONS + "/:country", (req, res) => {

        var country = req.params.country
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for (var i = 0; i < Object.keys(req.query).length; i++) {
            var element = Object.keys(req.query)[i];
            if (element != "from" && element != "to") {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        //Comprobamos si from es mas pequeño o igual a to
        if (from > to) {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        db.find({}).sort({year: 1}).exec(function(err, filteredList) {

            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            filteredList = filteredList.filter((reg) => {
                return (reg.country == country);
            });

            // Apartado para from y to
            var from = req.query.from;
            var to = req.query.to;

            //Comprobamos si from es mas pequeño o igual a to
            if (from > to) {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }

            if (from != null && to != null && from <= to) {
                filteredList = filteredList.filter((reg) => {
                    return (reg.year >= from && reg.year <= to);
                });

            }
            //COMPROBAMOS SI EXISTE
            if (filteredList == 0) {
                res.sendStatus(404, "NO EXISTE");
                return;
            }
            //RESULTADO

            //Paginación
            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = paginacion(req, filteredList);
            }
            filteredList.forEach((element) => {
                delete element._id;
            });
            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "percentages_access_elecetricity"  && element != "non_renewable_energy_consumptions" && element != "renewable_energy_consumptions"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }
            res.send(JSON.stringify(filteredList, null, 2));
        })

    })

    // GET por país y año

    app.get(BASE_API_URL_ENERGY_CONSUMPTIONS + "/:country/:year", (req, res) => {

        var country = req.params.country
        var year = req.params.year

        db.find({}).sort({year: 1}).exec(function(err, filteredList) {

            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            filteredList = filteredList.filter((reg) => {
                return (reg.country == country && reg.year == year);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NO EXISTE");
                return;
            }

            //RESULTADO

            //Paginación
            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = paginacion(req, filteredList);
                res.send(JSON.stringify(filteredList, null, 2));
            }
            filteredList.forEach((element) => {
                delete element._id;
            });
            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "percentages_access_elecetricity"  && element != "non_renewable_energy_consumptions" && element != "renewable_energy_consumptions"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }
            res.send(JSON.stringify(filteredList[0], null, 2));
        });
    })

    // POST para lista de recursos

    app.post(BASE_API_URL_ENERGY_CONSUMPTIONS, (req, res) => {

        if (comprobar_body(req)) {
            res.sendStatus(400, "BAD REQUEST - Parametros incorrectos");
        } else {
            db.find({}, function (err, filteredList) {

                if (err) {
                    res.sendStatus(500, "ERROR EN CLIENTE");
                    return;
                }

                filteredList = filteredList.filter((reg) => {
                    return (req.body.country == reg.country && req.body.year == reg.year)
                })

                if (filteredList.length != 0) {
                    res.sendStatus(409, "CONFLICT");
                } else {
                    db.insert(req.body);
                    res.sendStatus(201, "CREATED");
                }
            })
        }
    })

    // POST para recurso concreto

    app.post(BASE_API_URL_ENERGY_CONSUMPTIONS + "/:country", (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    })

    // PUT de una lista de recursos

    app.put(BASE_API_URL_ENERGY_CONSUMPTIONS, (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    })

    // PUT de un recurso especifico

    app.put(BASE_API_URL_ENERGY_CONSUMPTIONS + "/:country/:year", (req, res) => {

        //Comprobamos Formato JSON

        if (comprobar_body(req)) {
            res.sendStatus(400, "BAD REQUEST - Parametros incorrectos");
            return;
        }
        var countryR = req.params.country;
        var yearR = req.params.year;
        var body = req.body;

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            //COMPROBAMOS SI EXISTE EL ELEMENTO

            filteredList = filteredList.filter((reg) => {
                return (reg.country == countryR && reg.year == yearR);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NO EXISTE");
                return;
            }

            //COMPROBAMOS SI LOS CAMPOS ACTUALIZADOS SON IGUALES

            if (countryR != body.country || yearR != body.year) {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }

            //ACTUALIZAMOS VALOR

            db.update({$and:[{country: String(countryR)}, {year: parseInt(yearR)}]}, {$set: body}, {},function(err, numUpdated) {
                if (err) {
                    res.sendStatus(500, "ERROR EN CLIENTE");
                }else{
                    res.sendStatus(200,"UPDATED");
                }
            });
        })
    })

    // DELETE de una lista de recursos

    app.delete(BASE_API_URL_ENERGY_CONSUMPTIONS,(req, res)=>{
        db.remove({}, { multi: true }, (err, numRemoved)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
            res.sendStatus(200,"DELETED");
            return;
        });
    })

    // DELETE de un recurso especifico

    app.delete(BASE_API_URL_ENERGY_CONSUMPTIONS+"/:country/:year",(req, res)=>{
        var countryR = req.params.country;
        var yearR = req.params.year;

        db.find({country: countryR, year: parseInt(yearR)}, {}, (err, filteredList)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
            if(filteredList==0){
                res.sendStatus(404,"NOT FOUND");
                return;
            }
            db.remove({country: countryR, year: parseInt(yearR)}, {}, (err, numRemoved)=>{
                if (err){
                    res.sendStatus(500,"ERROR EN CLIENTE");
                    return;
                }
            
                res.sendStatus(200,"DELETED");
                return;
                
            });
        });

    })

    // Método auxiliares

    function comprobar_body(req) {
        return (req.body.country == null |
            req.body.year == null |
            req.body.percentages_access_elecetricity == null |
            req.body.non_renewable_energy_consumptions == null |
            req.body.renewable_energy_consumptions == null);
    }

    function paginacion(req, lista){

        var res = [];
        const limit = req.query.limit;
        const offset = req.query.offset;
        
        if(limit < 1 || offset < 0 || offset > lista.length){
            res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
            return res;
        }

        res = lista.slice(offset,parseInt(limit)+parseInt(offset));
        return res;

    }

    function comprobar_fields(req, lista){
        var fields = req.query.fields;

        var contieneCountry = false;
        var contieneYear = false;
        var contiene_Electricity = false;
        var contiene_Renewable = false;
        var contiene_Non_Renewable = false;
        fields = fields.split(",");

        for(var i = 0; i<fields.length;i++){
            var element = fields[i];
            if(element=='country'){
                contieneCountry=true;
            }
            if(element=='year'){
                contieneYear=true;
            }
            if(element=='percentages_access_elecetricity'){
                contiene_Electricity=true;
            }
            if(element=='non_renewable_energy_consumptions'){
                contiene_Non_Renewable=true;
            }
            if(element=='renewable_energy_consumptions'){
                contiene_Renewable=true;
            }
        }

        //Country
        if(!contieneCountry){
            lista.forEach((element)=>{
                delete element.country;
            })
        }

        //Year
        if(!contieneYear){
            lista.forEach((element)=>{
                delete element.year;
            })
        }

        //Electricity
        if(!contiene_Electricity){
            lista.forEach((element)=>{
                delete element.percentages_access_elecetricity;
            })
        }

        //Now Renewable consumptions
        if(!contiene_Non_Renewable){
            lista.forEach((element)=>{
                delete element.non_renewable_energy_consumptions;
            })
        }

        //Renewable consumptions
        if(!contiene_Renewable){
            lista.forEach((element)=>{
                delete element.renewable_energy_consumptions;
            })
        }

        return lista;

    }
}
