<script>

    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";
    

    let entry = {};

    let updatedCountry;
    let updatedYear;
    let updatedElectricity;
    let updateNonRenewable;
    let updateRenewable;
    let errorC = null;


    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/energy-consumptions/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            entry = data;
            updatedCountry = entry.country;
            updatedYear = entry.year;
            updatedElectricity = entry.percentages_access_elecetricity;
            updateNonRenewable = entry.non_renewable_energy_consumptions;
            updateRenewable = entry.renewable_energy_consumptions;
        }else{
            Errores(res.status, params.country, params.year);
            
        }
    }

    async function EditEntry(){
        console.log("Updating entry...."+updatedCountry);
        const res = await fetch("/api/v2/energy-consumptions/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    percentages_access_elecetricity: updatedElectricity,
                    non_renewable_energy_consumptions: updateNonRenewable,
                    renewable_energy_consumptions: updateRenewable
                }),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
                errorC = 200.1;
                window.location.href = `/#/energy-consumptions/200.5/${params.country}/${params.year}`;
			});     
    }

    async function Errores(code, country, year){
        
        let msg;
        if(code == 404){
            errorC = 404;
        }
        if(code == 400){
            errorC = 400;
        }
        if(code == 409){
            errorC = 409;
        }
        if(code == 401){
            errorC = 401;
        }
        if(code == 405){
            errorC = 405;
        }
            return;
    }

</script>

<main>
    <h1>Editar entrada "{params.country}"/"{params.year}"</h1>
    {#await entry}
    loading
        {:then entry}
        {#if errorC === 200.1}
        <UncontrolledAlert  color="success" >
            Actualizado con éxito el país {params.country} en el año {params.year}.
        </UncontrolledAlert>
    {/if}
    {#if errorC === 404}
        <UncontrolledAlert  color="danger" >
            No existe un dato con el país {params.country} en el año {params.year}
        </UncontrolledAlert>
    {/if}
    {#if errorC === 400}
        <UncontrolledAlert  color="danger" >
            La petición no está correctamente formulada.
        </UncontrolledAlert>
    {/if}
    {#if errorC === 409}
    <UncontrolledAlert  color="danger" >
        El dato introducido ya existe.
    </UncontrolledAlert>
    {/if}
    {#if errorC === 401}
        <UncontrolledAlert  color="danger" >
            No autorizado.
        </UncontrolledAlert>
    {/if}
    {#if errorC === 405}
        <UncontrolledAlert  color="danger" >
            Método no permitido.
        </UncontrolledAlert>
    {/if}
        
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Acceso a la electricidad</th>
                    <th>Energía No Renovable Consumida</th>
                    <th>Energía Renovable Consumida</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input type="number" bind:value="{updatedElectricity}"></td>
                    <td><input type="number" bind:value="{updateNonRenewable}"></td>
                    <td><input type="number" bind:value="{updateRenewable}"></td>
                    <td><Button outline color="primary" on:click="{
                        function(){
                            errorC = null;
                            EditEntry()}}">
                        Editar
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    {/await}
    
    <Button outline color="secondary" on:click="{function(){
        window.location.href = `/#/energy-consumptions`
    }}">Volver</Button>

    </main>