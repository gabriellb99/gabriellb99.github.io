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
    let ages_zero_fifty = [];
    let ages_fifty_seventy = [];
    let ages_seventy = [];



    async function getData(){

        let res_population;
        let res_registrations;
        res_population = await fetch(`/api/v2/population-levels`);
        res_registrations = await fetch(`https://sos2122-24.herokuapp.com/api/v2/pneumonia-stats`);

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
                    ages_zero_fifty.push(json_reg[index].ages_zero_fifty);
                    ages_fifty_seventy.push(json_reg[index].ages_fifty_seventy);
                    ages_seventy.push(json_reg[index].ages_seventy);
                    json_reg.splice(index, 1);
                }else{
                    ages_zero_fifty.push(0);
                    ages_fifty_seventy.push(0);
                    ages_seventy.push(0);
                }
                deathData.push(json[i].death_rate);
                lifeData.push(json[i].life_expectancy_birth);
                birthData.push(json[i].birth_rate);
            }
            for(let i = 0; i<rangoMax; i++){
                fechas.push(json_reg[i].country+"/"+json_reg[i].year);
                ages_zero_fifty.push(json_reg[i].ages_zero_fifty);
                ages_fifty_seventy.push(json_reg[i].ages_fifty_seventy);
                ages_seventy.push(json_reg[i].ages_seventy);
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
                type:'area'
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
                area: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
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
                    name: 'Muertes 0-50 años',
                    data: ages_zero_fifty,
                },{
                    name: '	Muertes 50-70 años',
                    data: ages_fifty_seventy,
                },{
                    name: '	Muertes 70 años',
                    data: ages_seventy,
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
        <h1 align="center">Gráficas integrada de niveles de población y tasa de muertes por neumonia</h1>
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