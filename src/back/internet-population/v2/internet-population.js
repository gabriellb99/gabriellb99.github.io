const bodyParser = require("body-parser");

const BASE_API_URL_INTERNET_POPULATION = "/api/v2/internet-population";

//API Germán Blanco Pérez-Victoria


var internet_population = [
    {
        country: "spain",
        year: 2008,
        population_growth: 1.595,
        internet_users: 59.6,
        urban_population: 77.976
    },
    {
        country: "spain",
        year: 2010,
        population_growth: 0.460,
        internet_users: 65.8,
        urban_population: 78.446
    },
    {
        country: "spain",
        year: 2014,
        population_growth: -0.299,
        internet_users: 76.19,
        urban_population: 79.366
    },
    {
        country: "germany",
        year: 2008,
        population_growth: -0.19,
        internet_users: 78,
        urban_population: 76.575
    },
    {
        country: "germany",
        year: 2010,
        population_growth: -0.153,
        internet_users: 82,
        urban_population: 76.966
    },
    {
        country: "germany",
        year: 2014,
        population_growth: 0.417,
        internet_users: 86.19,
        urban_population: 77.190
    },
    {
        country: "united kingdom",
        year: 2008,
        population_growth: 0.787,
        internet_users: 78.39,
        urban_population: 80.757
    },
    {
        country: "united kingdom",
        year: 2010,
        population_growth: 0.784,
        internet_users: 85,
        urban_population: 81.302
    },
    {
        country: "united kingdom",
        year: 2014,
        population_growth: 0.736,
        internet_users: 91.61,
        urban_population: 82.365
    },
    {
        country: "argentina",
        year: 2008,
        population_growth: 0.993,
        internet_users: 28.113,
        urban_population: 90.53
    },
    {
        country: "argentina",
        year: 2010,
        population_growth: 0.752,
        internet_users: 45,
        urban_population: 90.849
    },
    {
        country: "argentina",
        year: 2014,
        population_growth: 1.099,
        internet_users: 64.7,
        urban_population: 91.377
    },
    {
        country: "norway",
        year: 2008,
        population_growth: 1.246,
        internet_users: 90.57,
        urban_population: 78.526
    },
    {
        country: "norway",
        year: 2010,
        population_growth: 1.246,
        internet_users: 93.39,
        urban_population: 79.102
    },
    {
        country: "norway",
        year: 2014,
        population_growth: 1.128,
        internet_users: 96.3,
        urban_population: 80.692
    },
    {
        country: "australia",
        year: 2008,
        population_growth: 2.004,
        internet_users: 71.67,
        urban_population: 84.493
    },
    {
        country: "australia",
        year: 2010,
        population_growth: 1.555,
        internet_users: 76,
        urban_population: 85.182
    },
    {
        country: "australia",
        year: 2014,
        population_growth: 1.492,
        internet_users: 84,
        urban_population: 85.602
    },
    {
        country: "morocco",
        year: 2008,
        population_growth: 1.19,
        internet_users: 33.1,
        urban_population: 56.886
    },
    {
        country: "morocco",
        year: 2010,
        population_growth: 1.289,
        internet_users: 52,
        urban_population: 58.018
    },
    {
        country: "morocco",
        year: 2014,
        population_growth: 1.404,
        internet_users: 56.8,
        urban_population: 60.256
    },
    {
        country: "japan",
        year: 2008,
        population_growth: 0.048,
        internet_users: 75.4,
        urban_population: 89.103
    },
    {
        country: "japan",
        year: 2010,
        population_growth: 0.018,
        internet_users: 78.21,
        urban_population: 90.812
    },
    {
        country: "japan",
        year: 2014,
        population_growth: -0.133,
        internet_users: 89.107,
        urban_population: 91.304
    },
    {
        country: "united states",
        year: 2010,
        population_growth: 0.83,
        internet_users: 71.69,
        urban_population: 80.772
    },
    {
        country: "united states",
        year: 2014,
        population_growth: 0.733,
        internet_users: 73,
        urban_population: 81.483
    }
]
    
module.exports.register = (app,db) =>{
    /* 
        API para internet-population
    */
    
    // Cargar datos iniciales
    
    app.get(BASE_API_URL_INTERNET_POPULATION+"/loadInitialData",(req, res)=>{
    
        db.find({},function(err, filteredList){

            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }
            if (filteredList==0){
                for(var i = 0; i<internet_population.length;i++){
                    db.insert(internet_population[i]);
                }
                res.sendStatus(200, "OK.")
                return;
            }else{
                res.sendStatus(200, "Ya inicializados")
            }
            
        });
        
    })
    
    // Documentos
    
    app.get(BASE_API_URL_INTERNET_POPULATION+"/docs",(req,res)=>
    {
        res.redirect("https://documenter.getpostman.com/view/19899210/UVsSLi1g")
    })
    
    //GETs
    
    // GET global y GET por año
    
    app.get(BASE_API_URL_INTERNET_POPULATION,(req, res)=>{
    
        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for(var i = 0; i<Object.keys(req.query).length;i++){
            var element = Object.keys(req.query)[i];
            if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset"){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        //Comprobamos si from es mas pequeño o igual a to
        if(from>to){
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        db.find({},function(err, filteredList){

            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            // Apartado para búsqueda por año
            
            if(year != null){
                var filteredList = filteredList.filter((reg)=>
                {
                    return (reg.year == year);
                });
                if (filteredList==0){
                    res.sendStatus(404, "NO EXISTE");
                    return;
                }
            }
    
            // Apartado para from y to
            
            if(from != null && to != null){
                filteredList = filteredList.filter((reg)=>
                {
                    return (reg.year >= from && reg.year <=to);
                });
    
                if (filteredList==0){
                    res.sendStatus(404, "NO EXISTE");
                    return;
                }    
            }
            // RESULTADO
    
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredList = paginacion(req,filteredList);
            }
            filteredList.forEach((element)=>{
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "death_rate" && element != "life_expectancy_birth" && element != "birth_rate"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }

            res.send(JSON.stringify(filteredList,null,2));
        })
    })
    
    // GET por país
    
    app.get(BASE_API_URL_INTERNET_POPULATION+"/:country",(req, res)=>{
    
        var country =req.params.country;
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for(var i = 0; i<Object.keys(req.query).length;i++){
            var element = Object.keys(req.query)[i];
            if(element != "from" && element != "to"){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        //Comprobamos si from es mas pequeño o igual a to
        if(from>to){
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        db.find({}, function(err,filteredList){
            
            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            filteredList = filteredList.filter((reg)=>
            {
                return (reg.country == country);
            });
        
            // Apartado para from y to
            var from = req.query.from;
            var to = req.query.to;
    
            //Comprobamos si from es mas pequeño o igual a to
            if(from>to){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        
            if(from != null && to != null && from<=to){
                filteredList = filteredList.filter((reg)=>
                {
                   return (reg.year >= from && reg.year <=to);
                }); 
                
            }
            //COMPROBAMOS SI EXISTE
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
                return;
            }
            //RESULTADO
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredList = paginacion(req,filteredList);
            }
            filteredList.forEach((element)=>{
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "death_rate" && element != "life_expectancy_birth" && element != "birth_rate"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }

            res.send(JSON.stringify(filteredList,null,2));
        })

    })
    
    // GET por país y año
    
    app.get(BASE_API_URL_INTERNET_POPULATION+"/:country/:year",(req, res)=>{
    
        var country =req.params.country
        var year = req.params.year

        db.find({},function(err, filteredList){

            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            filteredList = filteredList.filter((reg)=>
            {
                return (reg.country == country && reg.year == year);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
                return;
            }
    
            //RESULTADO
    
            //Paginación
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredList = paginacion(req,filteredList);
                res.send(JSON.stringify(filteredList,null,2));
            }
            filteredList.forEach((element)=>{
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "death_rate" && element != "life_expectancy_birth" && element != "birth_rate"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }

            res.send(JSON.stringify(filteredList[0],null,2));
        });
    })
    
    //POSTs
    
    // POST para lista de recursos
    
    app.post(BASE_API_URL_INTERNET_POPULATION,(req, res)=>{
        
        if(comprobar_body(req)){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        }else{

            db.find({},function(err,filteredList){

                if(err){
                    res.sendStatus(500, "ERROR EN CLIENTE");
                    return;
                }

                filteredList = filteredList.filter((reg)=>
                {
                    return(req.body.country == reg.country && req.body.year == reg.year)
                })
            
                if(filteredList.length != 0){
                    res.sendStatus(409,"CONFLICT");
                }else{
                    db.insert(req.body);
                    res.sendStatus(201,"CREATED");
                }
            })
        }
    
    })
    
    // POST para recurso concreto
    
    app.post(BASE_API_URL_INTERNET_POPULATION+"/:country",(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    // PUTs
    
    // PUT de una lista de recursos
    
    app.put(BASE_API_URL_INTERNET_POPULATION,(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    // PUT de un recurso especifico
    
    app.put(BASE_API_URL_INTERNET_POPULATION+"/:country/:year",(req, res)=>{
        
        //COMPROBAMOS FORMATO JSON

        if(comprobar_body(req)){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
            return;
        }
        
        var countryR = req.params.country;
        var yearR = req.params.year;
        var body = req.body;  

        db.find({},function(err,filteredList){
            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            //COMPROBAMOS SI EXISTE EL ELEMENTO

            filteredList = filteredList.filter((reg)=>
            {
                return (reg.country == countryR && reg.year == yearR);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
                return;
            }

            //COMPROBAMOS SI LOS CAMPOS ACTUALIZADOS SON IGUALES

            if(countryR != body.country || yearR != body.year){
                res.sendStatus(400,"BAD REQUEST");
                return;
            }

            //ACTUALIZAMOS VALOR
                
            db.update({country: countryR, year: yearR }, {$set: body}, {},function(err, updatedDb) {
                if (err) {
                    res.sendStatus(500, "ERROR EN CLIENTE");
                }else{
                    res.sendStatus(200,"UPDATED");
                }
            });
        })
    
    })
    
    // DELETEs
    
    // DELETE de una lista de recursos
    
    app.delete(BASE_API_URL_INTERNET_POPULATION,(req, res)=>{
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
    
    app.delete(BASE_API_URL_INTERNET_POPULATION+"/:country/:year",(req, res)=>{
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
    
    function comprobar_body(req){
        return (req.body.country == null |
                 req.body.year == null | 
                 req.body.population_growth == null | 
                 req.body.internet_users == null | 
                 req.body.urban_population == null);
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
        var contiene_growth = false;
        var contiene_internet = false;
        var contiene_urban = false;
        fields = fields.split(",");

        for(var i = 0; i<fields.length;i++){
            var element = fields[i];
            if(element=='country'){
                contieneCountry=true;
            }
            if(element=='year'){
                contieneYear=true;
            }
            if(element=='population_growth'){
                contiene_growth=true;
            }
            if(element=='internet_users'){
                contiene_internet=true;
            }
            if(element=='urban_population'){
                contiene_urban=true;
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

        //Population growth
        if(!contiene_growth){
            lista.forEach((element)=>{
                delete element.population_growth;
            })
        }

        //Life expectancy birth
        if(!contiene_internet){
            lista.forEach((element)=>{
                delete element.internet_population;
            })
        }

        //Birth rates
        if(!contiene_urban){
            lista.forEach((element)=>{
                delete element.urban_population;
            })
        }

        return lista;

    }
}