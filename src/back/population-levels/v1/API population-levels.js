const bodyParser = require("body-parser");

const BASE_API_URL_POPULATION_LEVELS = "/api/v1/population-levels";

//API Alejandro Molinos Eligio

var population_levels = [
    {
        country: "argentina",
        year: 2019,
        death_rate: 8.14,
        life_expectancy_birth: 77.33,
        birth_rate: 17.23
    },
    {
        country: "albania",
        year: 2020,
        death_rate: 8.56,
        life_expectancy_birth: 79.10,
        birth_rate: 31.76
    },
    {
        country: "bangladesh",
        year: 2020,
        death_rate: 6.10,
        life_expectancy_birth: 73.24,
        birth_rate: 18.33
    },
    {
        country: "bangladesh",
        year: 2011,
        death_rate: 6.32,
        life_expectancy_birth: 70.43,
        birth_rate: 20.89
    },
    {
        country: "bangladesh",
        year: 2015,
        death_rate: 6.45,
        life_expectancy_birth: 71.23,
        birth_rate: 10.88
    },
    {
        country: "barbados",
        year: 2020,
        death_rate: 9.78,
        life_expectancy_birth: 80.67,
        birth_rate: 11.23
    },
    {
        country: "barbados",
        year: 2014,
        death_rate: 8.03,
        life_expectancy_birth: 78.35,
        birth_rate: 11.11
    },
    {
        country: "barbados",
        year: 2015,
        death_rate: 8.43,
        life_expectancy_birth: 78.15,
        birth_rate: 10.78
    },{
        country: "china",
        year: 2018,
        death_rate: 7.87,
        life_expectancy_birth: 77.56,
        birth_rate: 11.32
    },
    {
        country: "china",
        year: 2012,
        death_rate: 8.66,
        life_expectancy_birth: 75.89,
        birth_rate: 12.78
    },
    {
        country: "china",
        year: 2013,
        death_rate: 7.76,
        life_expectancy_birth: 75.33,
        birth_rate: 12.45
    },{
        country: "chile",
        year: 2018,
        death_rate: 6.16,
        life_expectancy_birth: 80.04,
        birth_rate: 12.43
    },
    {
        country: "chile",
        year: 2012,
        death_rate: 5.73,
        life_expectancy_birth: 79.18,
        birth_rate: 14.26
    },
    {
        country: "chile",
        year: 2013,
        death_rate: 5.79,
        life_expectancy_birth: 79.35,
        birth_rate: 14.00
    },{
        country: "gabon",
        year: 2018,
        death_rate: 6.83,
        life_expectancy_birth: 66.19,
        birth_rate: 31.61
    },
    {
        country: "gabon",
        year: 2020,
        death_rate: 6.60,
        life_expectancy_birth: 66.69,
        birth_rate: 30.26
    },
    {
        country: "gabon",
        year: 2016,
        death_rate: 7.20,
        life_expectancy_birth: 65.42,
        birth_rate: 32.60
    },
    {
        country: "spain",
        year: 2015,
        death_rate: 9.77,
        life_expectancy_birth: 57.67,
        birth_rate: 12.65
    },
    {
        country: "spain",
        year: 2016,
        death_rate: 7.34,
        life_expectancy_birth: 62.24,
        birth_rate: 13.13
    },
    {
        country: "canada",
        year: 2016,
        death_rate: 7.22,
        life_expectancy_birth: 82.34,
        birth_rate: 11.98
    },
    {
        country: "brazil",
        year: 2016,
        death_rate: 6.89,
        life_expectancy_birth: 75.67,
        birth_rate: 14.56
    },
    {
        country: "belgium",
        year: 2019,
        death_rate: 10.34,
        life_expectancy_birth: 82.34,
        birth_rate: 10.45
    },
    {
        country: "australia",
        year: 2019,
        death_rate: 7.32,
        life_expectancy_birth: 82.88,
        birth_rate: 12.78
    },
    {
        country: "australia",
        year: 2019,
        death_rate: 7.79,
        life_expectancy_birth: 82.32,
        birth_rate: 12.56
    },
    {
        country: "australia",
        year: 2015,
        death_rate: 6.56,
        life_expectancy_birth: 83.12,
        birth_rate: 12.23
    }
]

module.exports.register = (app,db) =>{
    /* 
        API para Population-levels
    */
    
    // Cargar datos iniciales
    
    app.get(BASE_API_URL_POPULATION_LEVELS+"/loadInitialData",(req, res)=>{

        db.find({},function(err, filteredList){

            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }
            if (filteredList==0){
                for(var i = 0; i<population_levels.length;i++){
                    db.insert(population_levels[i]);
                }
                res.sendStatus(200, "OK.")
                return;
            }else{
                res.sendStatus(200, "Ya inicializados")
            }
        });
        
    })
    
    // Documentos

    app.get(BASE_API_URL_POPULATION_LEVELS+"/docs",(req,res)=>
    {
        res.redirect("https://documenter.getpostman.com/view/20091922/UyrDCF8G")
    })
    
    // GETs
    
    // GET global y GET por año
    
    app.get(BASE_API_URL_POPULATION_LEVELS,(req, res)=>{
    
        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for(var i = 0; i<Object.keys(req.query).length;i++){
            var element = Object.keys(req.query)[i];
            if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset" && element != "fields"){
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
    
    app.get(BASE_API_URL_POPULATION_LEVELS+"/:country",(req, res)=>{
    
        var country =req.params.country;
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for(var i = 0; i<Object.keys(req.query).length;i++){
            var element = Object.keys(req.query)[i];
            if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset" && element != "fields"){
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
    
    app.get(BASE_API_URL_POPULATION_LEVELS+"/:country/:year",(req, res)=>{
    
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
    
    // POSTs
    
    // POST para lista de recursos
    
    app.post(BASE_API_URL_POPULATION_LEVELS,(req, res)=>{
        
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
    
    app.post(BASE_API_URL_POPULATION_LEVELS+"/:country",(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    // PUTs
    
    // PUT de una lista de recursos
    
    app.put(BASE_API_URL_POPULATION_LEVELS,(req, res)=>{
        
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    // PUT de un recurso especifico
    
    app.put(BASE_API_URL_POPULATION_LEVELS+"/:country/:year",(req, res)=>{
        
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
                
            db.update({$and:[{country: String(countryR)}, {year: parseInt(yearR)}]}, {$set: body}, {},function(err, numUpdated) {
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
    
    app.delete(BASE_API_URL_POPULATION_LEVELS,(req, res)=>{
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
    
    app.delete(BASE_API_URL_POPULATION_LEVELS+"/:country/:year",(req, res)=>{
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
                 req.body.death_rate == null | 
                 req.body.life_expectancy_birth == null | 
                 req.body.birth_rate == null);
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
        var contiene_Death_rate = false;
        var contiene_Life = false;
        var contiene_Birth = false;
        fields = fields.split(",");

        for(var i = 0; i<fields.length;i++){
            var element = fields[i];
            if(element=='country'){
                contieneCountry=true;
            }
            if(element=='year'){
                contieneYear=true;
            }
            if(element=='death_rate'){
                contiene_Death_rate=true;
            }
            if(element=='life_expectancy_birth'){
                contiene_Life=true;
            }
            if(element=='birth_rate'){
                contiene_Birth=true;
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

        //Death rate
        if(!contiene_Death_rate){
            lista.forEach((element)=>{
                delete element.death_rate;
            })
        }

        //Life expectancy birth
        if(!contiene_Life){
            lista.forEach((element)=>{
                delete element.life_expectancy_birth;
            })
        }

        //Birth rates
        if(!contiene_Birth){
            lista.forEach((element)=>{
                delete element.birth_rate;
            })
        }

        return lista;

    }
}
