<script>
    import {onMount} from 'svelte';
    export let params = {};
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    let populationData = [];
    let internetData = [];
    let urbanData = [];
    let average = [];
    let country = params.country

    async function getData(){

        let res;

        if(country==null){
            res = await fetch(`/api/v2/internet-population`);
        }else{
            res = await fetch(`/api/v2/internet-population/${country}`);
        }
        if (res.ok) {
            const json = await res.json();
            for(let i = 0; i<json.length; i++){
                let aux = [];
                aux.push(json[i].year);
                aux.push(json[i].population_growth);
                populationData.push(aux);

                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].internet_users);
                internetData.push(aux);
                
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].urban_population);
                urbanData.push(aux);

                aux = [];
                aux.push(json[i].year);
                aux.push((json[i].internet_users + json[i].urban_population)/2);
                average.push(aux);
            }
            console.log(json);
            if(country==null){
                populationData = [];
                internetData = [];
                urbanData = [];
            }
            country = null;
            await delay(1000);
            loadGraph();
        }else{
            window.alert('El país introducido no tiene registros');
            populationData = [];
            internetData = [];
            urbanData = [];
            await delay(1000);
            loadGraph();
        }
}

async function loadGraph(){
    Highcharts.chart('container', {
    title: {
        text: 'Relación entre usuarios de internet y población urbana'
    },
    xAxis: {
        categories: ['Usuarios de internet', 'Población urbana']
    },
    series: [{
        type: 'column',
        name: 'Usuarios de internet',
        data: internetData
    }, {
        type: 'column',
        name: 'Población urbana',
        data: urbanData
    }, {
        type: 'spline',
        name: 'Average',
        data: average,
        marker: {
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[3],
            fillColor: 'white'
        }
    }]
});

Highcharts.chart('container2', {
    title: {
        text: `Crecimiento de población en ${params.country}`
    },
    xAxis: {
        categories: ['Crecimiento de población']
    },
    credits: {
        enabled: false
    },
    series: [{
        type: 'column',
        name: 'Crecimiento de población',
        data: populationData
    }, {
        type: 'spline',
        name: 'Average',
        data: populationData,
        marker: {
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[3],
            fillColor: 'white'
        }
    }]
});
}

onMount(getData);

</script>
<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
    <br>
        <h1 align="center">Gráficas de {params.country}</h1>
        <div align="center">
            <input type="text" bind:value="{country}">
            <Button outline color="info" on:click="{()=>{
                window.location.href = `/#/internet-population/higraph/${country}`;
                location.reload();
            }}">
            Buscar
            </Button>
        </div>
        <br>
        <figure class="highcharts-figure">
            <div id="container"></div>
        </figure>
        <br><br>
        <figure class="highcharts-figure">
            <div id="container2"></div>
        </figure>
        <br>
        <Button outline color="dark" on:click="{()=>{
            pop();
        }}">
        Volver
        </Button>
        <br><br>
</main>