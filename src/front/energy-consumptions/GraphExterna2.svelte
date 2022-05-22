<script>
    import FusionCharts from "fusioncharts";
    import Charts from "fusioncharts/fusioncharts.charts";
    import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
    import SvelteFC, { fcRoot } from "svelte-fusioncharts";
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";
    import { onMount } from "svelte";
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";

    // Always set FusionCharts as the first parameter
    fcRoot(FusionCharts, Charts, FusionTheme);

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    var chartConfigs = {};
    var dataSource = {};
    let categorias = [];
    let total = [];
    let nrenewable = [];
    let renewable = [];
    let height_feet = [];
    let height_inches = [];
    let fga = [];
    let errorC = null;

    async function getData() {
        await fetch(`/api/v2/energy-consumptions/loadInitialData`);
        let res = await fetch(`/api/v2/energy-consumptions`);

        if (res.ok) {
            let maxData = 5;
            const json = await res.json();

            //Llamada a la API externa.
            const options = {
                method: "GET",
                headers: {
                    "X-RapidAPI-Host": "free-nba.p.rapidapi.com",
                    "X-RapidAPI-Key":
                        "b2f2a8944dmsh61c32662d0a13a0p19c219jsn1c59d67d0308",
                },
            };

            let response = await fetch(
                "https://free-nba.p.rapidapi.com/stats?page=0&per_page=25",
                options
            );
            const jsonp = await response.json();

            console.log(jsonp.data);

            for (let i = 0; i < maxData; i++) {
                //Dato del año
                categorias.push({
                    label: json[i].year.toString() + "-" + json[i].country,
                });

                //Dato de acceso a la electricidad
                total.push({ value: json[i].percentages_access_elecetricity });

                //Dato de energia no renovable consumida
                nrenewable.push({
                    value: json[i].non_renewable_energy_consumptions,
                });

                //Dato de energia renovable consumida
                renewable.push({
                    value: json[i].renewable_energy_consumptions,
                });

                height_feet.push({ value: 0 });
                height_inches.push({ value: 0 });
                fga.push({ value: 0 });
            }

            for (let i = 0; i < maxData; i++) {
                //Los datos de esta API tienen similitudes entre los primeros datos por eso vamos a coger datos aleatorios entre ellos

                
                //Dato del año
                categorias.push({
                    label: jsonp.data[i].game.season + "-" + jsonp.data[i].team.city + "(" + jsonp.data[i].player.first_name + ")",
                });

                height_feet.push({ value: jsonp.data[i].player.height_feet });

                height_inches.push({
                    value: jsonp.data[i].player.height_inches,
                });

                fga.push({
                    value: jsonp.data[i].fga,
                });

                total.push({ value: 0 });
                nrenewable.push({ value: 0 });
                renewable.push({ value: 0 });
            }
            await delay(1000);

            dataSource = {
                chart: {
                    caption: "Integración API Externa NBA",
                    numbersuffix: "",
                    showsum: "1",
                    xAxisname: "Year-Country",
                    yAxisName: "% and numbers",
                    plottooltext: "$label <b>$dataValue</b> $seriesName",
                    theme: "fusion",
                    showvalues: "0",
                },
                categories: [
                    {
                        category: categorias,
                    },
                ],
                dataset: [
                    {
                        seriesname: "Acceso a la electricidad",
                        data: total,
                    },
                    {
                        seriesname: "Energía No Renovable Consumida",
                        data: nrenewable,
                    },
                    {
                        seriesname: "Energía Renovable Consumida",
                        data: renewable,
                    },
                    {
                        seriesname: "Pies de altura",
                        data: height_feet,
                    },
                    {
                        seriesname: "Pulgadas de altura",
                        data: height_inches,
                    },
                    {
                        seriesname: "Tarjetas",
                        data: fga,
                    },
                ],
            };
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
        chartConfigs = {
            type: "msbar3d",
            width: 1000,
            height: 600,
            renderAt: "chart-container",
            dataSource,
        };
    }
    onMount(getData);
</script>

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
    <SvelteFC {...chartConfigs} />
</div>
