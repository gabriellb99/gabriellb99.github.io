<script>
	export let params = {};
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
	import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";

    let entries = [];

	let from = null;
	let to = null;
	let offset = 0;
	let limit = 10;

	let maxPages = 0;
	let numEntries;

	let codAct = null;
	codAct = parseFloat(params.codAct);
	let errorC = null;
	console.log(codAct);

	let newEntry = {
		country: "",
		year: "",
		population_growth: "",
        internet_users: "",
        urban_population: ""
	}

    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
		let cadena = `/api/v2/internet-population?limit=${limit}&&offset=${offset*10}&&`;
		if (from != null) {
			cadena = cadena + `from=${from}&&`
		}
		if (to != null) {
			cadena = cadena + `to=${to}&&`
		}
        const res = await fetch(cadena); 
        if(res.ok){
			let cadenaPag = cadena.split(`limit=${limit}&&offset=${offset*10}`);
			maxPagesFunction(cadenaPag[0]+cadenaPag[1]);
            const data = await res.json();
            entries = data;
			numEntries = entries.length;
            console.log("Received entries: "+entries.length);
        }else{
			Errores(res.status);
		}
    }

	async function insertEntry(){
        console.log("Inserting entry...."+JSON.stringify(newEntry));
        const res = await fetch("/api/v2/internet-population",
			{
				method: "POST",
				body: JSON.stringify(newEntry),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function(){
					getEntries();
					errorC = 200.1;
			});
    }

	async function BorrarEntry(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v2/internet-population/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				if(numEntries==1){
					from = null;
					to = null;
				}
				getEntries();
				errorC=200.2;
			});
    }

	async function BorrarEntries(){
        console.log("Deleting entries....");
        const res = await fetch("/api/v2/internet-population/",
			{
				method: "DELETE"
			}).then(function (res){
				from = null;
				to = null;
				getEntries();
				errorC=200.3;
			});
    }

	async function LoadEntries(){
        console.log("Loading entries....");
        const res = await fetch("/api/v2/internet-population/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getEntries();
				errorC=200.4;
			});
    }

	//Funciones auxiliares

	async function Errores(code){
        
        let msg;
        if(code == 400){
			errorC=400;
            msg = "La fecha inicio no puede ser menor a la fecha fin"
        }
		if(code = 404){
			errorC=404;
			msg = "No hay datos para hacer la búsqueda."
		}
		if(code == 409){
			errorC=409;
            msg = "El dato "+newEntry.country+"/"+newEntry.year+" ya existe"
        }
            return;
    }

	async function maxPagesFunction(cadena){
		let num;
        const res = await fetch(cadena,
			{
				method: "GET"
			});
			if(res.ok){
				const data = await res.json();
				maxPages = Math.floor(data.length/10);
				if(maxPages === data.length/10){
					maxPages = maxPages-1;
				}
        }
	}

</script>

<main>
   
    <h1>Lista usuarios de internet</h1>

{#await entries}
loading
	{:then entries}

	{#if errorC === 200.1}
        <UncontrolledAlert  color="success" >
            Entrada insertada con éxito.
        </UncontrolledAlert>
    {/if}
	{#if errorC === 200.2}
        <UncontrolledAlert  color="success" >
			Entrada eliminada con éxito.    
        </UncontrolledAlert>
    {/if}
	{#if errorC === 200.3}
        <UncontrolledAlert  color="success" >
			Entradas eliminadas con éxito.
        </UncontrolledAlert>
    {/if}
	{#if errorC === 200.4}
        <UncontrolledAlert  color="success" >
			Datos cargados con éxito.
        </UncontrolledAlert>
    {/if}
	{#if codAct === 200.5}
        <UncontrolledAlert  color="success" >
			Actualizado con éxito el país {params.country} en el año {params.year}.
        </UncontrolledAlert>
    {/if}
	{#if errorC === 400}
        <UncontrolledAlert  color="danger" >
			La fecha inicio no puede ser menor a la fecha fin
        </UncontrolledAlert>
    {/if}
	{#if errorC === 404}
        <UncontrolledAlert  color="danger" >
			No hay datos para hacer la búsqueda.
        </UncontrolledAlert>
    {/if}
	{#if errorC === 1}
        <UncontrolledAlert  color="danger" >
			Los campos fecha inicio y fecha fin no pueden estar vacíos.
        </UncontrolledAlert>
    {/if}

	<Table bordered>
		<thead>
			<tr>
				<th>Fecha inicio</th>
				<th>Fecha fin</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input type="number" min="2000" bind:value="{from}"></td>
				<td><input type="number" min="2000" bind:value="{to}"></td>
				<td align="center"><Button outline color="dark" on:click="{()=>{
					if (from == null || to == null) {
						errorC=1;
					}else{
						getEntries();
					}
				}}">
					Buscar
					</Button>
				</td>
				<td align="center"><Button outline color="info" on:click="{()=>{
					from = null;
					to = null;
					getEntries();
					
				}}">
					Limpiar Búsqueda
					</Button>
				</td>
			</tr>
		</tbody>
	</Table>
	
	<Table bordered>
		<thead>
			<tr>
				<th>País</th>
				<th>Año</th>
				<th>Crecimiento de población</th>
				<th>Usuarios de internet</th>
                <th>Población urbana</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newEntry.country}"></td>
				<td><input type="number" bind:value="{newEntry.year}"></td>
				<td><input type="number" bind:value="{newEntry.population_growth}"></td>
                <td><input type="number" bind:value="{newEntry.internet_users}"></td>
                <td><input type="number" bind:value="{newEntry.urban_population}"></td>
				<td><Button outline color="primary" on:click="{insertEntry}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.country}</td>
					<td>{entry.year}</td>
					<td>{entry.population_growth}</td>
                    <td>{entry.internet_users}</td>
                    <td>{entry.urban_population}</td>
					<td align="center">
						<Button outline color="success" on:click={function(){
							window.location.href = `/#/internet-population/graph/${entry.country}`;
						}}>Gráfica neg</Button>
						<Button outline color="success" on:click={function(){
							window.location.href = `/#/internet-population/graphC/${entry.country}`;
						}}>Gráfica comb</Button>
					</td>
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/#/internet-population/${entry.country}/${entry.year}`
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={BorrarEntry(entry.country,entry.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>
	<div align="center">
		{#each Array(maxPages+1) as _,page}
		
			<Button outline color="secondary" on:click={()=>{
				offset = page;
				getEntries();
			}}>{page} </Button>&nbsp
	
		{/each}
		</div>
	<div align="center">
		<Button outline color="success" on:click={LoadEntries}>
			Cargar datos
		</Button>&nbsp
		<Button outline color="danger" on:click={BorrarEntries}>
			Borrar todo
		</Button>
	</div>
	<br>
	<br>

{/await}

</main>