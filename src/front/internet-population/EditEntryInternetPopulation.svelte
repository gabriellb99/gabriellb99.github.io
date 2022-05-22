<script>
    export let params = {};
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";

    let entry = {};

    let updatedCountry;
    let updatedYear;
    let updatedPopulationGrowth;
    let updatedInternetUsers;
    let updatedUrbanPopulation;

    let errorC = null;
    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/internet-population/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            entry = data;
            updatedCountry = entry.country;
            updatedYear = entry.year;
            updatedPopulationGrowth = entry.population_growth;
            updatedInternetUsers = entry.internet_users;
            updatedUrbanPopulation = entry.urban_population;
        }else{
            Errores(res.status);
        }
    }

    async function EditEntry(){
        console.log("Updating entry...."+updatedCountry);
        const res = await fetch("/api/v2/internet-population/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    population_growth: updatedPopulationGrowth,
                    internet_users: updatedInternetUsers,
                    urban_population: updatedUrbanPopulation
                }),
				headers: {
					"Content-Type": "application/json"
				}
            }).then(function (res){
                errorC = 200.1;
                window.location.href = `/#/internet-population/200.5/${params.country}/${params.year}`;
			}); 
    }

    async function Errores(code){
        
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
                    <th>Crecimeinto de población</th>
                    <th>Usuarios de Internet</th>
                    <th>Población urbana</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input bind:value="{updatedPopulationGrowth}"></td>
                    <td><input bind:value="{updatedInternetUsers}"></td>
                    <td><input bind:value="{updatedUrbanPopulation}"></td>
                    <td><Button outline color="primary" on:click="{
                        function(){
                            errorC=null;
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