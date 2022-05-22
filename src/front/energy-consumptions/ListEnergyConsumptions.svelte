<script>
	export let params = {};
	import { onMount } from "svelte";
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";

	let entries = [];

	let from = 0;
	let to = 2022;
	let offset = 0;
	let limit = 10;
	let maxPages = 0;
	let max = 0;
	let codAct = null;
	codAct = parseFloat(params.codAct);
	let errorC = null;

	let newEntry = {
		country: "",
		year: "",
		percentages_access_elecetricity: "",
		non_renewable_energy_consumptions: "",
		renewable_energy_consumptions: "",
	};

	async function getEntries() {
		console.log("Fetching entries....");
		let cadena = `/api/v2/energy-consumptions?`;
		if (from != null) {
			cadena = cadena + `from=${from}&&`;
		}
		if (to != null) {
			cadena = cadena + `to=${to}&&`;
		}
		console.log(cadena);
		const res = await fetch(cadena);
		if (res.ok) {
			let cadena2 = cadena + `limit=${limit}&&offset=${offset * 10}`;
			const data = await res.json();
			entries = data;
			maxPagesFunction(entries.length);
			console.log("Received entries: " + entries.length);

			//Comprobar datos con paginacion
			const res2 = await fetch(cadena2);
			const data2 = await res2.json();
			entries = data2;
			if (entries.length < 2) {
				let cadena3 = cadena + `limit=${limit}&&offset=${0}`;
				const res3 = await fetch(cadena3);
				const data3 = await res3.json();
				entries = data3;
			}
		} else {
			Errores(res.status);
		}
	}

	async function insertEntry() {
		console.log("Inserting entry...." + JSON.stringify(newEntry));
		const res = await fetch("/api/v2/energy-consumptions", {
			method: "POST",
			body: JSON.stringify(newEntry),
			headers: {
				"Content-Type": "application/json",
			},
		}).then(function () {
			getEntries();
			errorC = 200.1;
		});
	}

	async function BorrarEntry(countryDelete, yearDelete) {
		console.log("Deleting entry....");
		const res = await fetch(
			"/api/v2/energy-consumptions/" + countryDelete + "/" + yearDelete,
			{
				method: "DELETE",
			}
		).then(function () {
			getEntries();
			errorC = 200.2;
		});
	}

	async function BorrarEntries() {
		console.log("Deleting entries....");
		const res = await fetch("/api/v2/energy-consumptions/", {
			method: "DELETE",
		}).then(function () {
			getEntriesD();
			errorC = 200.3;
		});
	}

	async function getEntriesD() {
		console.log("Fetching entries....");
		const res = await fetch("/api/v2/energy-consumptions");
		if (res.ok) {
			const data = await res.json();
			entries = data;
			maxPagesFunction(entries.length);
			console.log("Received entries: " + entries.length);
		}
	}

	async function LoadEntries() {
		console.log("Loading entries....");
		const res = await fetch("/api/v2/energy-consumptions/loadInitialData", {
			method: "GET",
		}).then(function () {
			getEntries();
			errorC = 200.4;
		});
	}

	async function Errores(code) {
		if (code == 400) {
			errorC = 400;
		}
		if ((code = 404)) {
			errorC = 404;
		}
		return;
	}

	async function maxPagesFunction(total) {
		maxPages = Math.floor(total / 10);
		if (maxPages === total / 10) {
			maxPages = maxPages - 1;
		}
	}

	onMount(getEntries);
</script>

<main>
	<h1>Consumo de Energía Renovable y no Renovable</h1>

	{#await entries}
		loading
	{:then entries}
		{#if errorC === 200.1}
			<UncontrolledAlert color="success">
				Entrada insertada con éxito.
			</UncontrolledAlert>
		{/if}
		{#if errorC === 200.2}
			<UncontrolledAlert color="success">
				Entrada eliminada con éxito.
			</UncontrolledAlert>
		{/if}
		{#if errorC === 200.3}
			<UncontrolledAlert color="success">
				Entradas eliminadas con éxito.
			</UncontrolledAlert>
		{/if}
		{#if errorC === 200.4}
			<UncontrolledAlert color="success">
				Datos cargados con éxito.
			</UncontrolledAlert>
		{/if}
		{#if codAct === 200.5}
			<UncontrolledAlert color="success">
				Actualizado con éxito el país {params.country} en el año {params.year}.
			</UncontrolledAlert>
		{/if}
		{#if errorC === 400}
			<UncontrolledAlert color="danger">
				La fecha inicio no puede ser menor a la fecha fin
			</UncontrolledAlert>
		{/if}
		{#if errorC === 404}
			<UncontrolledAlert color="danger">
				No hay datos para hacer la búsqueda.
			</UncontrolledAlert>
		{/if}

		<Table bordered>
			<thead>
				<tr>
					<th>Fecha Inicio</th>
					<th>Fecha Fin</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><input type="number" bind:value={from} /></td>
					<td><input type="number" bind:value={to} /></td>
					<td align="center"
						><Button outline color="primary" on:click={getEntries}
							>Buscar</Button
						></td
					>
					<td align="center"
						><Button
							outline
							color="info"
							on:click={() => {
								from = 0;
								to = 2022;
								getEntries();
							}}
						>
							Limpiar Búsqueda
						</Button>
					</td></tr
				>
			</tbody>
		</Table>

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
					<td><input bind:value={newEntry.country} /></td>
					<td><input type="number" bind:value={newEntry.year} /></td>
					<td
						><input
							type="number"
							bind:value={newEntry.percentages_access_elecetricity}
						/></td
					>
					<td
						><input
							type="number"
							bind:value={newEntry.non_renewable_energy_consumptions}
						/></td
					>
					<td
						><input
							type="number"
							bind:value={newEntry.renewable_energy_consumptions}
						/></td
					>
					<td align="center"
						><Button outline color="primary" on:click={insertEntry}>
							Añadir
						</Button>
					</td>
				</tr>
				{#each entries as entry}
					<tr>
						<td>{entry.country}</td>
						<td>{entry.year}</td>
						<td>{entry.percentages_access_elecetricity}</td>
						<td>{entry.non_renewable_energy_consumptions}</td>
						<td>{entry.renewable_energy_consumptions}</td>
						<td align="center"
							><Button
								outline
								color="success"
								on:click={function () {
									window.location.href = `/#/energy-consumptions/graph/${entry.country}`;
								}}
							>
								Gráfica FusionChart
							</Button>
							<Button
								outline
								color="success"
								on:click={function () {
									window.location.href = `/#/energy-consumptions/higraph/${entry.country}`;
								}}
							>
								Gráfica Highcharts
							</Button>
						</td><td
							><Button
								outline
								color="warning"
								on:click={function () {
									window.location.href = `/#/energy-consumptions/${entry.country}/${entry.year}`;
								}}
							>
								Editar
							</Button>
						</td><td
							><Button
								outline
								color="danger"
								on:click={function () {
									errorC = null;
									BorrarEntry(entry.country, entry.year);
								}}
							>
								Borrar
							</Button>
						</td>
					</tr>
				{/each}
			</tbody>
		</Table>
		<div align="center">
			{#each Array(maxPages + 1) as _, page}
				<Button
					outline
					color="secondary"
					on:click={() => {
						offset = page;
						getEntries();
					}}
					>{page}
				</Button>&nbsp
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
	{/await}
</main>
