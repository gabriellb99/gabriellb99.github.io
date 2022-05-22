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
    let ar_ym = [];
    let ar_yw = [];
    let ar_ty = [];
    let errorC = null;

    async function getData() {
        await fetch(`/api/v2/energy-consumptions/loadInitialData`);
        await fetch(`https://sos2122-31.herokuapp.com/api/v2/alphabetization-stats/loadInitialData`);
        let res = await fetch(`/api/v2/energy-consumptions`);
        let res2 = await fetch(
            `https://sos2122-31.herokuapp.com/api/v2/alphabetization-stats`
        );

        if (res.ok && res2.ok) {
            let maxData = 5;
            const json = await res.json();
            const json2 = await res2.json();
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

                ar_ym.push({ value: 0 });
                ar_yw.push({ value: 0 });
                ar_ty.push({ value: 0 });
            }

            for (let i = 0; i < maxData; i++) {
                //Dato del año
                categorias.push({
                    label: json2[i].year.toString() + "-" + json[i].country,
                });

                //Dato de acceso a la electricidad
                ar_ym.push({ value: json2[i].ar_ym });

                //Dato de energia no renovable consumida
                ar_yw.push({
                    value: json2[i].ar_yw,
                });

                //Dato de energia renovable consumida
                ar_ty.push({
                    value: json2[i].ar_ty,
                });

                total.push({ value: 0 });
                nrenewable.push({ value: 0 });
                renewable.push({ value: 0 });
            }
            await delay(1000);

            dataSource = {
                chart: {
                    caption: "Consumo de Energía Renovable y no Renovable",
                    numbersuffix: " %",
                    showsum: "1",
                    xAxisname: "Año-País",
                    yAxisName: "Porcentaje",
                    plottooltext: "$label <b>$dataValue</b> $seriesName",
                    theme: "fusion",
                    drawcrossline: "1",
                },
                categories: [
                    {
                        category: categorias,
                    },
                ],
                dataset: [
                    {
                        seriesname: "Acceso a la electricidad",
                        renderAs: "line",
                        data: total,
                    },
                    {
                        seriesname: "Energía No Renovable Consumida",
                        data: nrenewable,
                    },
                    {
                        seriesname: "Energía Renovable Consumida",
                        renderAs: "area",
                        showAnchors: "0",
                        data: renewable,
                    },
                    {
                        seriesname: "Media Hombres",
                        renderAs: "line",
                        showAnchors: "0",
                        data: ar_ym,
                    },
                    {
                        seriesname: "Media Mujeres",
                        data: ar_yw,
                    },
                    {
                        seriesname: "Media Total",
                        renderAs: "area",
                        showAnchors: "0",
                        data: ar_ty,
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
