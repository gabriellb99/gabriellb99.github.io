<script>
    import { onMount } from "svelte";
    export let params = {};
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    let categorias = [];
    let total = [];
    let nrenewable = [];
    let renewable = [];
    let errorC = null;
    let country = params.country;

    async function getData() {
        let res;

        if (country == null) {
            res = await fetch(`/api/v2/energy-consumptions`);
        } else {
            res = await fetch(`/api/v2/energy-consumptions/${country}`);
        }
        if (res.ok) {
            const json = await res.json();
            for (let i = 0; i < json.length; i++) {
                categorias.push(json[i].year.toString());
                total.push(json[i].percentages_access_elecetricity);
                nrenewable.push(json[i].non_renewable_energy_consumptions);
                renewable.push(json[i].renewable_energy_consumptions);
            }
            if (country == null) {
                categorias = [];
                total = [];
                nrenewable = [];
                renewable = [];
            }
            await delay(1000);
            loadGraph();
        } else {
            errorC = 404;
            total = [];
            nrenewable = [];
            renewable = [];
            await delay(1000);
            loadGraph();
        }
    }

    async function loadGraph() {
        Highcharts.chart("container", {
            chart: {
                type: "column",
            },
            title: {
                text: "Gráfica sobre el consumo de la electricidad",
            },
            xAxis: {
                categories: categorias,
                crosshair: true,
                title: {
                    text: "Año",
                },
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Porcentage",
                },
            },
            tooltip: {
                headerFormat:
                    '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                    '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
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
            El país introducido no tiene registros.
        </UncontrolledAlert>
    {/if}
    <br />
    <h1 align="center">Gráficas de {params.country}</h1>
    <div align="center">
        <input type="text" bind:value={country} />
        <Button
            outline
            color="info"
            on:click={() => {
                window.location.href = `/#/energy-consumptions/higraph/${country}`;
                location.reload();
            }}
        >
            Buscar
        </Button>
        <Button outline color="warning" on:click="{()=>{
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
