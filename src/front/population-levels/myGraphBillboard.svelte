<script>

    import {onMount} from 'svelte';
    export let params = {};
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";

    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    let errorC = 0;
    let birthData = ["Tasa de natalidad"];
    let deathData = ["Tasa de mortalidad"];
    let lifeData = ["Esperanza de vida"];
    let ejeX = ["x"];
    let country = params.country;

    async function getData(){

        await delay(2000)
        let res;

        if(country==null){
            res = await fetch(`/api/v2/population-levels`);
        }else{
            res = await fetch(`/api/v2/population-levels/${country}`);
        }
        if (res.ok) {
            const json = await res.json();
            for(let i = 0; i<json.length; i++){
                
                ejeX.push(json[i].year);

                //Dato de tasa de mortalidad
                deathData.push(json[i].death_rate);

                //Dato de esperanza de vida
                lifeData.push(json[i].life_expectancy_birth);
                
                //Dato de tasa de natalidad
                birthData.push(json[i].birth_rate);
            }
            console.log(json);
            if(country==null){
                birthData = [];
                deathData = [];
                lifeData = [];
            }
            country = null;
            await delay(1000);
            loadGraph();
        }else{
            errorC = 200.4;
            birthData = [];
            deathData = [];
            lifeData = [];
            await delay(1000);
            loadGraph();
        }
    }
    
    async function loadGraph(){
        var chart = bb.generate({
            bindto: "#bubbleChart",
            data: {
                type: "bubble",
                labels:true,
                x: "x",
                columns: [
                    ejeX,
                    birthData,
                    deathData
                ]
            },
            bubble: {
                maxR: 50
            },
        });

        var chart2 = bb.generate({
            bindto: "#chart2",
            data: {
                type: "bubble",
                labels:true,
                x: "x",
                columns: [
                    ejeX,
                    lifeData
                ]
            },
            bubble: {
                maxR: 50
            },
        });

        var chart_colectivo = bb.generate({
            bindto: "#chart_colectivo",
            data: {
                type: "bubble",
                labels:true,
                x: "x",
                columns: [
                    ejeX,
                    birthData,
                    deathData,
                    lifeData
                ]
            },
            bubble: {
                maxR: 50
            },
        });
    }
    
    onMount(getData);
    
    </script>
    <svelte:head>

        <script src="https://d3js.org/d3.v6.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/billboard.js/3.4.1/billboard.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/billboard.js/3.4.1/billboard.min.js" on:load="{loadGraph}"></script>
    
    </svelte:head>
    
    <main>
        {#if errorC === 200.4}
        <UncontrolledAlert  color="danger" >
			ERROR: NO EXISTEN DATOS PARA EL PAÍS INTRODUCIDO
        </UncontrolledAlert>
    {/if}
        <br>
        <h1 align="center">Gráficas de {params.country}</h1>
        <div align="center">
            <input type="text" bind:value="{country}">
            <Button outline color="info" on:click="{()=>{
                window.location.href = `/#/population-levels_graph_billboard/${country}`;
                location.reload();
                
            }}">
            Buscar
            </Button>
        </div>
        <br>
        <div id="bubbleChart" align="center"></div>
        <br>
        <div id="chart2"></div>
        <br>
        <div id="chart_colectivo"></div>
        <Button outline color="dark" on:click="{()=>{
            pop();
        }}">
        Volver
        </Button>
        <br><br>
    </main>