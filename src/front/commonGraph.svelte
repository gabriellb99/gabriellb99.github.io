<script>

    import {onMount} from 'svelte';
    export let params = {};
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";
    
    const delay = ms => new Promise(res => setTimeout(res, ms));

    let errorC = null;
    
    //Pais
    let country = params.country;

    //Datos population levels

    let birthData = [];
    let deathData = [];
    let lifeData = [];

   //Datos internet population

    let growthData = [];
    let usersData = [];
    let urbanData = [];

    //Datos energy consumptions

    let percentData = [];
    let nonRenewableData = [];
    let renewableData = [];

    async function getData(){

        let res_population;
        let res_energy;
        let res_internet;
        await fetch(`/api/v2/population-levels/loadInitialData`);
        await fetch(`/api/v2/energy-consumptions/loadInitialData`);
        await fetch(`/api/v2/internet-population/loadInitialData`);

        if(country==null){
            res_population = await fetch(`/api/v2/population-levels`);
            res_energy = await fetch(`/api/v2/energy-consumptions`);
            res_internet = await fetch(`/api/v2/internet-population`);
        }else{
            res_population = await fetch(`/api/v2/population-levels/${country}`);
            res_energy = await fetch(`/api/v2/energy-consumptions/${country}`);
            res_internet = await fetch(`/api/v2/internet-population/${country}`);
        }
        if (res_population.ok && res_energy.ok && res_internet.ok) {
            const json_population = await res_population.json();
            const json_energy = await res_energy.json();
            const json_internet = await res_internet.json();
            guardaDatosPopulation(json_population);
            guardaDatosEnergy(json_energy);
            guardaDatosInternet(json_internet);

            if(country==null){
                birthData = [];
                deathData = [];
                lifeData = [];
                growthData = [];
                usersData = [];
                urbanData = [];
                percentData = [];
                nonRenewableData = [];
                renewableData = [];
            }
            console.log(json_population);
            console.log(json_energy);
            console.log(json_internet);

            country = null;
            await delay(1000);
            loadGraph();
        }else{
            errorC = 404;
            birthData = [];
            deathData = [];
            lifeData = [];
            growthData = [];
            usersData = [];
            urbanData = [];
            percentData = [];
            nonRenewableData = [];
            renewableData = [];
            await delay(1000);
            loadGraph();
        }
    }
    
    async function guardaDatosPopulation(json){
        for(let i = 0; i<json.length; i++){
                let aux = [];
                aux.push(json[i].year);
                aux.push(json[i].death_rate);
                deathData.push(aux);

                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].life_expectancy_birth);
                lifeData.push(aux);
                
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].birth_rate);
                birthData.push(aux);
            }
            console.log(deathData);
            console.log(lifeData);
            console.log(birthData);
    }

    async function guardaDatosEnergy(json){
        for(let i = 0; i<json.length; i++){
                let aux = [];
                aux.push(json[i].year);
                aux.push(json[i].percentages_access_elecetricity);
                percentData.push(aux);

                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].non_renewable_energy_consumptions);
                nonRenewableData.push(aux);
                
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].renewable_energy_consumptions);
                renewableData.push(aux);
            }
            console.log(percentData);
            console.log(nonRenewableData);
            console.log(renewableData);
    }

    async function guardaDatosInternet(json){
        for(let i = 0; i<json.length; i++){
                let aux = [];
                aux.push(json[i].year);
                aux.push(json[i].population_growth);
                growthData.push(aux);

                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].internet_users);
                usersData.push(aux);
                
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].urban_population);
                urbanData.push(aux);
            }
    }

    async function loadGraph(){
        
        Highcharts.chart('container', {
        
            title: {
                text: `Gráfico común a todo el grupo`
            },
        
            yAxis: {
                title: {
                    text: 'Valor'
                }
            },
        
            xAxis: {
                accessibility: {
                    title: {
                    text: 'Año'
                }
                }
            },
        
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
        
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    }
                }
            },
            series: [
                //Population levels
                {
                    name: 'Tasa de mortalidad',
                    data: deathData
                },
                {
                    name: 'Tasa de natalidad',
                    data: birthData
                },
                {
                    name: 'Esperanza de vida',
                    data: lifeData
                },
                // Internet population
                {
                    name: 'Crecimiento de población',
                    data: growthData
                },
                {
                    name: 'Usuarios de internet',
                    data: usersData
                },
                {
                    name: 'Población urbana',
                    data: urbanData
                },
                
                // Energy consumptions
                {
                    name: 'Acceso a la electricidad',
                    data: percentData
                },
                {
                    name: 'Energía No Renovable Consumida',
                    data: nonRenewableData
                },
                {
                    name: 'Energía Renovable Consumida',
                    data: renewableData
                },
            ]
        
        });
    }
    
    onMount(getData);
    
    </script>
    <svelte:head>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/series-label.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
    
    </svelte:head>
    
    <main>

        {#if errorC === 404}
        <UncontrolledAlert  color="danger" >
            El país introducido no tiene registros para alguna de las APIS.
        </UncontrolledAlert>
        {/if}
        <br>
        
        <div align="center">
            <input type="text" bind:value="{country}">
            <Button outline color="info" on:click="{()=>{
                window.location.href = `/#/commonGraph/${country}`;
                location.reload();
                
            }}">
            Buscar
            </Button>
        </div>
        <br>
        <figure class="highcharts-figure">
            <div id="container"></div>
        </figure>
        <br>
        <br>
        <Button outline color="dark" on:click="{()=>{
            pop();
        }}">
        Volver
        </Button>
        <br><br>
    </main>