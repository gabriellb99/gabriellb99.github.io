<script>
    import FusionCharts from "fusioncharts";
    import Charts from "fusioncharts/fusioncharts.charts";
    import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
    import SvelteFC, { fcRoot } from "svelte-fusioncharts";
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";
    import {onMount} from 'svelte';
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
    let cases = [];
    let active_cases = [];
    let serious_critical = [];
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
                    "X-RapidAPI-Host":
                        "corona-virus-world-and-india-data.p.rapidapi.com",
                    "X-RapidAPI-Key":
                        "b2f2a8944dmsh61c32662d0a13a0p19c219jsn1c59d67d0308",
                },
            };

            let response = await fetch(
                "https://corona-virus-world-and-india-data.p.rapidapi.com/api",
                options
            );
            const jsonp = await response.json();
           
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

                cases.push({ value: 0 });
                active_cases.push({ value: 0 });
                serious_critical.push({ value: 0 });
            }

            for (let i = 0; i < maxData; i++) {
                //Dato del año
                categorias.push({
                    label: "2020-" + jsonp.countries_stat[i].country_name,
                });

                //Casos Covid los datos lo ponemos en porcentaje teniendo en cuenta que el 100% es 100.000.000
                var p = jsonp.countries_stat[i].cases
                var pr = parseInt(p.replace(/,/gi, ''))/1000000;
                cases.push({ value:  pr.toString()});

                 //Casos activos de Covid los datos lo ponemos en porcentaje teniendo en cuenta que el 100% es 10.000.000
                var p2 = jsonp.countries_stat[i].active_cases
                var pr2 = parseInt(p2.replace(/,/gi, ''))/100000;
                active_cases.push({
                    value: pr2.toString()
                });

                //Casos criticos de Covid los datos lo ponemos en porcentaje teniendo en cuenta que el 100% es 1.000.000
                var p3 = jsonp.countries_stat[i].serious_critical
                var pr3 = parseInt(p3.replace(/,/gi, ''))/10000;
                serious_critical.push({
                    value: pr3.toString()
                });

                total.push({ value: 0 });
                nrenewable.push({ value: 0 });
                renewable.push({ value: 0 });
            }
            await delay(1000);

            dataSource = {
                chart: {
                    caption: "Integración API Externa Covid",
                    numbersuffix: "",
                    showsum: "1",
                    xAxisname: "Year-Country",
                    yAxisName: "% and numbers",
                    plottooltext: "$label <b>$dataValue</b> $seriesName",
                    theme: "gammel",
                    "showvalues": "0"
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
                        seriesname: "Casos Covid",
                        data: cases,
                    },
                    {
                        seriesname: "Activos",
                        data: active_cases,
                    },
                    {
                        seriesname: "Casos Críticos",
                        data: serious_critical,
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
            type: "mscombi2d",
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
