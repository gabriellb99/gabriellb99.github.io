<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
	import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";

	//Aquí se guardan todas las entradas de nuestra api

    let entries = [];

	//Variables para la utilización de la busqueda por fecha, paginación y limites

	let from = null;
	let to = null;
	let offset = 0;
	let limit = 10;

	//Código de error variables

	let errorC = null;

	//Límite máximo de páginas

	let maxPages = 0;
	let numEntries;

	let newEntry = {
		country: "",
		year: "",
		death_rate: "",
        life_expectancy_birth: "",
        birth_rate: ""
	}

	//Al cargar la página llamamos a getEntries que devuelve todas las entradas

    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
		let cadena = `/api/v2/population-levels?limit=${limit}&&offset=${offset*10}&&`;
		if (from != null) {
			cadena = cadena + `from=${from}&&`
		}
		if (to != null) {
			cadena = cadena + `to=${to}&&`
		}
		console.log(cadena);
        const res = await fetch(cadena); 
        if(res.ok){
			let cadenaPag = cadena.split(`limit=${limit}&&offset=${offset*10}`);
			maxPagesFunction(cadenaPag[0]+cadenaPag[1]);
            const data = await res.json();
            entries = data;
			numEntries = entries.length;
            console.log("Received entries: "+entries.length);
        }else{
			errorC = res.status;
		}
    }

	//Función para añadir una entrada

	async function insertEntry(){
        console.log("Inserting entry...."+JSON.stringify(newEntry));
        const res = await fetch("/api/v2/population-levels",
			{
				method: "POST",
				body: JSON.stringify(newEntry),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				newEntry = {
					country: "",
					year: "",
					death_rate: "",
					life_expectancy_birth: "",
					birth_rate: ""
				}
				getEntries();
				//Código de Entrada introducida con éxito
				errorC = 200.1;
			}); 
    }

	//Función para borrar una entrada

	async function BorrarEntry(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v2/population-levels/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				if(numEntries==1){
					from = null;
					to = null;
				}
				getEntries();
				offset=0;
				//Código de Entrada eliminada con éxito
				errorC = 200.2;
			});
    }

	//Función para borrar todas las entradas

	async function BorrarEntries(){
        console.log("Deleting entries....");
        const res = await fetch("/api/v2/population-levels/",
			{
				method: "DELETE"
			}).then(function (res){
				from = null;
				to = null;
				getEntries();
				offset=0;
				//Código de Entradas elimidas con éxito
				errorC = 200.3;
			});
		
    }

	//Función para cargar las entradas

	async function LoadEntries(){
        console.log("Loading entries....");
        const res = await fetch("/api/v2/population-levels/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getEntries();
				//Código de Entradas cargadas con éxito
				errorC = 200.4;
			});
    }
	
	//Función auxiliar para obtener el número máximo de páginas que se pueden ver

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
   
    <h1>Lista Niveles de Población</h1>

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
	{#if errorC === 400}
        <UncontrolledAlert  color="negative" >
			La fecha inicio no puede ser menor a la fecha fin
        </UncontrolledAlert>
    {/if}
	{#if errorC === 404}
        <UncontrolledAlert  color="negative" >
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
				<th>Tasa de mortalidad</th>
				<th>Esperanza de vida</th>
                <th>Tasa de natalidad</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newEntry.country}"></td>
				<td><input type="number" bind:value="{newEntry.year}"></td>
				<td><input type="number" bind:value="{newEntry.death_rate}"></td>
                <td><input type="number" bind:value="{newEntry.life_expectancy_birth}"></td>
                <td><input type="number" bind:value="{newEntry.birth_rate}"></td>
				<td><Button outline color="primary" on:click="{insertEntry}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.country}</td>
					<td>{entry.year}</td>
					<td>{entry.death_rate}</td>
                    <td>{entry.life_expectancy_birth}</td>
                    <td>{entry.birth_rate}</td>
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/#/population-levels/${entry.country}/${entry.year}`
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