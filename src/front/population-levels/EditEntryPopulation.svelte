<script>

    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";

    //Aquí se almacena la entrada correspondiente

    let entry = {};

    //Variables para la modificación

    let updatedCountry;
    let updatedYear;
    let updatedDeathRate;
    let updatedLifeExp;
    let updatedBirthRate;

    //Código de error auxiliar

    let errorC;

    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/population-levels/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            entry = data;
            updatedCountry = entry.country;
            updatedYear = entry.year;
            updatedDeathRate = entry.death_rate;
            updatedLifeExp = entry.life_expectancy_birth;
            updatedBirthRate = entry.birth_rate;
        }else{

            errorC = res.status;
        }
    }

    async function EditEntry(){
        console.log("Updating entry...."+updatedCountry);
        const res = await fetch("/api/v2/population-levels/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    death_rate: updatedDeathRate,
                    life_expectancy_birth: updatedLifeExp,
                    birth_rate: updatedBirthRate
                }),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function(){
                pop();
            }); 
    }


</script>

<main>
    <h1>Editar entrada "{params.country}"/"{params.year}"</h1>
    {#await entry}
    loading
        {:then entry}
        
        {#if errorC === 400}
        <UncontrolledAlert  color="danger" >
            La petición no está correctamente formulada
        </UncontrolledAlert>
    {/if}
	{#if errorC === 401}
        <UncontrolledAlert  color="danger" >
			No autorizado   
        </UncontrolledAlert>
    {/if}
	{#if errorC === 404}
        <UncontrolledAlert  color="danger" >
			La entrada <b>{params.country}/{params.year}</b> no existe
        </UncontrolledAlert>
    {/if}
	{#if errorC === 405}
        <UncontrolledAlert  color="danger" >
			Método no permitido
        </UncontrolledAlert>
    {/if}
	{#if errorC === 409}
        <UncontrolledAlert  color="danger" >
			El dato introducido ya existe
        </UncontrolledAlert>
    {/if}
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Tasa de mortalidad</th>
                    <th>Esperanza de vida</th>
                    <th>Tasa de natalidad</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input type="number" bind:value="{updatedDeathRate}"></td>
                    <td><input type="number" bind:value="{updatedLifeExp}"></td>
                    <td><input type="number" bind:value="{updatedBirthRate}"></td>
                    <td><Button outline color="success" on:click="{EditEntry}">
                        Editar
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
        <Button outline color="warning" on:click={function (){
            window.location.href = `/#/population-levels_graph/${params.country}`
        }}>
            VER GRÁFICA Highcharts
        </Button>
        <Button outline color="warning" on:click={function (){
            window.location.href = `/#/population-levels_graph_billboard/${params.country}`
        }}>
            VER GRÁFICA billboard
        </Button>
    {/await}
    
    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    </main>