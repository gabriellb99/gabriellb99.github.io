<script>

    import {onMount} from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";
    import Highcharts from "highcharts";
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    let errorC= 0;
    let fechas = [];
    let birthData = [];
    let deathData = [];
    let lifeData = [];
    let level1 = [];
    let level2 = [];
    let level3 = [];



    async function getData(){

        let res_population;
        let res_registrations;
        res_population = await fetch(`/api/v2/population-levels`);
        res_registrations = await fetch(`/remoteApiRegistration`);

        if (res_population.ok && res_registrations.ok) {
            const json = await res_population.json();
            const json_reg = await res_registrations.json();
            let rangoMax = 5;
            const country_years = [];
            for(let i = 0; i<json_reg.length;i++){
                country_years.push(json_reg[i].country+"/"+json_reg[i].year);
            }
            for(let i = 0; i<rangoMax; i++){
                let fecha = json[i].country+"/"+json[i].year;
                fechas.push(fecha);
                if(country_years.includes(fecha)){
                    let index = country_years.indexOf(fecha);
                    level1.push(json_reg[index].primarylevel);
                    level2.push(json_reg[index].secondarylevel);
                    level3.push(json_reg[index].tertiarylevel);
                    json_reg.splice(index, 1);
                }else{
                    level1.push(0);
                    level2.push(0);
                    level3.push(0);
                }
                deathData.push(json[i].death_rate);
                lifeData.push(json[i].life_expectancy_birth);
                birthData.push(json[i].birth_rate);
            }
            for(let i = 0; i<rangoMax; i++){
                fechas.push(json_reg[i].country+"/"+json_reg[i].year);
                level1.push(json_reg[i].primarylevel);
                level2.push(json_reg[i].secondarylevel);
                level3.push(json_reg[i].tertiarylevel);
                deathData.push(0);
                lifeData.push(0);
                birthData.push(0);
            }
            console.log(fechas);
            console.log(json_reg);
            await delay(1000);
            loadGraph();
        }else{
            errorC = 200.4;
            await delay(1000);
            loadGraph();
        }
    }
    
    async function loadGraph(){
        
        Highcharts.chart('container', {
        
            chart: {
                type:'column'
            },
            title: {
                text: `Gráfica conjunta `
            },
        
            yAxis: {
                min:0,
                title: {
                    text: 'Valor'
                }
            },
        
            xAxis: {
                categories: fechas,
                title: {
                    text: 'Ciudad/Año'
                },
                crosshair: true
            },
        
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
        
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
        
            series: [{
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
                {
                    name: 'Nivel Primario',
                    data: level1,
                },{
                    name: 'Nivel Secundario',
                    data: level2,
                },{
                    name: 'Nivel Terciario',
                    data: level3,
                }
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
        {#if errorC === 200.4}
        <br>
        <UncontrolledAlert  color="danger" >
			ERROR EN LA SOLICITUD A LOS DATOS
        </UncontrolledAlert>
        {/if}
        <br>
        <h1 align="center">Gráficas integrada de niveles de población y estadísitcas de registros</h1>
        <br>
        <figure class="highcharts-figure">
            <div id="container"></div>
        </figure>
        <br><br>
        <Button outline color="dark" on:click="{()=>{
            pop();
        }}">
        Volver
        </Button>
        <br><br>
    </main>