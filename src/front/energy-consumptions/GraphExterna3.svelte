<script>
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";
    import { onMount } from "svelte";
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";

    // Always set FusionCharts as the first parameter

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    let base_attack = [];
    let base_defense = [];
    

    let errorC = null;

    async function getData() {
        let res;

        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Host": "pokemon-go1.p.rapidapi.com",
                "X-RapidAPI-Key":
                    "b2f2a8944dmsh61c32662d0a13a0p19c219jsn1c59d67d0308",
            },
        };

        res = await fetch(
                "https://pokemon-go1.p.rapidapi.com/pokemon_stats.json",
                options
            );

        if (res.ok) {
            let maxData = 5;
            const json = await res.json();
            for (let i = 0; i < maxData; i++) {
                //Dato del año
                base_attack.push({ name:  json[i].pokemon_name, y: json[i].base_attack});
                base_defense.push({ name:  json[i].pokemon_name, y: json[i].base_defense});
            }

            await delay(1000);
            loadGraph();
        } else {
            errorC = 404;
            base_attack = [];
            base_defense = [];
            await delay(1000);
            loadGraph();
        }
    }

    async function loadGraph() {
        Highcharts.chart('div1', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Datos Pokemon Defensa'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f} points</b>'
    },
    accessibility: {
        point: {
            valueSuffix: ''
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Value',
        colorByPoint: true,
        data: base_defense
    }]
});
Highcharts.chart('div2', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Datos Pokemon Ataque'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f} points</b>'
    },
    accessibility: {
        point: {
            valueSuffix: ''
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Value',
        colorByPoint: true,
        data: base_attack
    }]
});




    }
    onMount(getData);
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

{#if errorC === 404}
    <UncontrolledAlert color="danger">
        Algunos datos no se obtuvieron correctamente.
    </UncontrolledAlert>
{/if}
<br />
<div align="left">
    <Button
        outline
        color="success"
        on:click={() => {
            pop();
        }}
    >
        Volver
    </Button>
    </div>
    <div>
        <figure class="highcharts-figure">
            <div id="div1"/>
            <div id="div2"/>
        </figure>
    </div>
