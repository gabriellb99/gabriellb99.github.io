<script>
    import {onMount} from 'svelte';
    export let params = {};
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";

    const delay = ms => new Promise(res => setTimeout(res, ms));

    let populationData = [];
    let internetData = [];
    let urbanData = [];
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

                populationData.push({ y: json[i].population_growth, label: json[i].year });

                internetData.push({ y: json[i].internet_users, label: json[i].year });

                urbanData.push({ y: json[i].urban_population, label: json[i].year });
            }
            console.log(internetData);
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
    var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	title:{
		text: "Relación entre usuarios de internet y población urbana"
	},
	axisY: {
		title: "years",
		includeZero: true
	},
	legend: {
		cursor:"pointer",
		itemclick : toggleDataSeries
	},
	toolTip: {
		shared: true,
		content: toolTipFormatter
	},
	data: [{
		type: "bar",
		showInLegend: true,
		name: "internet users",
		color: "red",
		dataPoints: internetData
	
	},
	{
		type: "bar",
		showInLegend: true,
		name: "urban population",
		color: "blue",
		dataPoints: 
			urbanData
	}]
});
chart.render();

function toolTipFormatter(e) {
	var str = "";
	var total = 0 ;
	var str2 ;
	for (var i = 0; i < e.entries.length; i++){
		var str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\">" + e.entries[i].dataSeries.name + "</span>: <strong>"+  e.entries[i].dataPoint.y + "</strong> <br/>" ;
		total = e.entries[i].dataPoint.y + total;
		str = str.concat(str1);
	}
	str2 = "<strong>" + e.entries[0].dataPoint.label + "</strong> <br/>";
	return (str2.concat(str));
}

function toggleDataSeries(e) {
	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else {
		e.dataSeries.visible = true;
	}
	chart.render();
}

}

onMount(getData);

</script>
<svelte:head>
    <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
</svelte:head>

<main>
    <br>
        <h1 align="center">Gráficas de {params.country}</h1>
        <div align="center">
            <input type="text" bind:value="{country}">
            <Button outline color="info" on:click="{()=>{
                window.location.href = `/#/internet-population/graph/${country}`;
                location.reload();
            }}">
            Buscar
            </Button>
        </div>
        <br>
        <div id="chartContainer" style="height: 370px; width: 100%;"></div>
        <br><br>

        <br>
        <Button outline color="dark" on:click="{()=>{
            pop();
        }}">
        Volver
        </Button>
        <br><br>
</main>