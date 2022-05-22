<script>
    import { onMount } from "svelte";
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    let categorias = [];
    let total = [];
    let nrenewable = [];
    let renewable = [];
    let co2_tot = [];
    let co2_kg = [];
    let co2_tpc = [];
    let errorC = null;

    async function getData() {
        let resE;
        let resC;

        resE =  await fetch(`/api/v2/energy-consumptions`);
        resC = await fetch(`/remoteApiCo2`);

        if (resE.ok && resC.ok) {
            const jsonE = await resE.json();
            const jsonC = await resC.json();
            let maxData = 5;
            for (let i = 0; i < maxData; i++) {
                categorias.push(jsonE[i].year.toString() + `-` + jsonE[i].country);
                total.push(jsonE[i].percentages_access_elecetricity);
                nrenewable.push(jsonE[i].non_renewable_energy_consumptions);
                renewable.push(jsonE[i].renewable_energy_consumptions);
                co2_tot.push(0);
                co2_kg.push(0);
                co2_tpc.push(0);
            }

            for (let i = 0; i < maxData; i++) {
                categorias.push(jsonC[i].year.toString() + `-` + jsonC[i].country);
                total.push(0);
                nrenewable.push(0);
                renewable.push(0);
                co2_tot.push(jsonC[i].co2_tot);
                co2_kg.push(jsonC[i].co2_kg);
                co2_tpc.push(jsonC[i].co2_tpc);
            }

            await delay(1000);
            loadGraph();
        }else{
            errorC = 404;
            await delay(1000);
            loadGraph();
        }
    }

    async function loadGraph() {
        Highcharts.chart("container", {
            chart: {
                type: "areaspline",
            },
            title: {
                text: "Gráficas Conjunta con API Co2",
            },
            xAxis: {
                categories: categorias,
                crosshair: true,
                title: {
                    text: "Año-País",
                },
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Porcentage y total",
                },
            },
            tooltip: {
                headerFormat:
                    '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                    '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: "</table>",
                shared: true,
                useHTML: true,
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                },
            },
            series: [
                {
                    name: "Acceso a la electricidad",
                    data: total,
                },
                {
                    name: "Energía No Renovable Consumida",
                    data: nrenewable,
                },
                {
                    name: "Energía Renovable Consumida",
                    data: renewable,
                },

                {
                    name: "Co2 por tpc",
                    data: co2_tpc,
                },

                {
                    name: "Co2 por kg",
                    data: co2_kg,
                },

                {
                    name: "Total Co2",
                    data: co2_tot,
                },
            ],
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

<main>
    {#if errorC === 404}
        <UncontrolledAlert color="danger">
            Algunos datos no se obtuvieron correctamente.
        </UncontrolledAlert>
    {/if}
    <br />
    <div align="left">
        <Button outline color="success" on:click="{()=>{
            pop();
        }}">
        Volver
        </Button>
    </div>
    <br />
    <figure class="highcharts-figure">
        <div id="container" />
    </figure>
</main>
