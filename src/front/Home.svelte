<script>
    import Button from 'sveltestrap/src/Button.svelte';
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";
    let errorC = 0;

    async function LoadEntries(){
        const res_pop = await fetch("/api/v2/population-levels/loadInitialData",
			{
				method: "GET"
			}).then(function (res_pop){
				//Código de Entradas cargadas con éxito
				errorC = 200.4;
			});
        const res_int = await fetch("/api/v2/internet-population/loadInitialData",
			{
				method: "GET"
			}).then(function (res_int){
				errorC=200.4;
			});
        const res_enr = await fetch("/api/v2/energy-consumptions/loadInitialData", {
                method: "GET",
            }).then(function (res_enr) {
                errorC = 200.4;
            });
    }

</script>
<main>
    <div style="text-align: center;">
        <h1 style="font-weight: bold;">SOS2122-10</h1>
    </div>
    
    <h2 style="font-weight: bold;">Team</h2>
    <ul>
        <li>
            - <a href="https://github.com/AlejandroMolinosEligio">
                [Alejandro Molinos Eligio]
            </a>
        </li>
        <li>
            - <a href="https://github.com/gabriellb99">
                [Gabriel López Bellido]
            </a>
        </li>
        <li>
            - <a href="https://github.com/germanblanco12">
                [Germán Blanco Pérez Victoria]
            </a>
        </li>
    </ul>
    <p style="font-weight: bold;">
        - Project description: </p>
        <p>Alejandro Molinos Eligio: Estudio de la población en la actualidad(population-levels),<br>
        Gabriel López Bellido: Estudios sobre el consumo de electricidad(energy-consumptions),<br>
        Germán Blanco Pérez Victoria: La relación entre usuarios en internet y la población urbana(internet-population).<br></p>
    
    <p style="font-weight: bold;">
        - Repository: 
    </p>
    <a href="https://github.com/gti-sos/SOS2122-10">
        [gti-sos/SOS2122-10]
    </a>
    <p style="font-weight: bold;">
        - URL:
    </p>
    <a href="http://sos2122-10.herokuapp.com/#/info">[http://sos2122-10.herokuapp.com]</a>
    <a href="http://sos2122-10.herokuapp.com/#/commonGraph/null">[http://sos2122-10.herokuapp.com/#/commonGraph]</a>
    <br>
    <p style="font-weight: bold;">
        -  Enlaces a API's:
    </p>
    <ul>
        <li>
            <ul>
                <li>Docs:
                    <ul>
                        <li>API_V1:<a href="https://sos2122-10.herokuapp.com/api/v1/population-levels/docs">[https://sos2122-10.herokuapp.com/api/v1/population-levels/docs]</a></li>
                        <li>API_V2:<a href="https://sos2122-10.herokuapp.com/api/v2/population-levels/docs">[https://sos2122-10.herokuapp.com/api/v2/population-levels/docs]</a></li>
                    </ul>
                </li>
                <li>API:
                    <ul>
                        <li>API_v1:<a href="https://sos2122-10.herokuapp.com/api/v1/population-levels">[https://sos2122-10.herokuapp.com/api/v1/population-levels]</a></li>
                        <li>API_v2:<a href="https://sos2122-10.herokuapp.com/api/v2/population-levels">[https://sos2122-10.herokuapp.com/api/v2/population-levels]</a></li>
                    </ul>
                </li>
                <li>Front-end:
                    <ul>
                        <li>API_v2:<a href="https://sos2122-10.herokuapp.com/#/population-levels">[https://sos2122-10.herokuapp.com/#/population-levels]</a></li>
                    </ul>
                </li>
            </ul>
            <br>
            (developed by <a href="https://github.com/AlejandroMolinosEligio">
            [Alejandro Molinos Eligio]
            
        </a>)</li>

        <br>
        <li>
            <ul>
                <li>DOC:
                    <ul>
                        <li>API_V1:<a href="https://sos2122-10.herokuapp.com/api/v1/energy-consumptions/docs">[https://sos2122-10.herokuapp.com/api/v1/energy-consumptions/docs]</a></li>
                        <li>API_V2:<a href="https://sos2122-10.herokuapp.com/api/v2/energy-consumptions/docs">[https://sos2122-10.herokuapp.com/api/v2/energy-consumptions/docs]</a></li>
                    </ul>
                </li>
                <li>API:
                    <ul>
                        <li>API_v1:<a href="https://sos2122-10.herokuapp.com/api/v1/energy-consumptions">[https://sos2122-10.herokuapp.com/api/v1/energy-consumptions]</a></li>
                        <li>API_v2:<a href="https://sos2122-10.herokuapp.com/api/v2/energy-consumptions">[https://sos2122-10.herokuapp.com/api/v2/energy-consumptions]</a></li>
                    </ul>
                </li>
                <li>Front-end:
                    <ul>
                        <li>API_v2:<a href="https://sos2122-10.herokuapp.com/#/energy-consumptions">[https://sos2122-10.herokuapp.com/#/energy-consumptions]</a></li>
                    </ul>
                </li>
                
            </ul>
            <br>
            (developed by <a href="https://github.com/gabriellb99">
            [Gabriel López Bellido]</a>)</li>

        <br>
        <li>
            <ul>
                <li>DOC:
                    <ul>
                        <li>API_V1:<a href="https://sos2122-10.herokuapp.com/api/v1/internet-population/docs">[https://sos2122-10.herokuapp.com/api/v2/internet-population/docs]</a></li>
                        <li>API_V2:<a href="https://sos2122-10.herokuapp.com/api/v2/internet-population/docs">[https://sos2122-10.herokuapp.com/api/v2/internet-population/docs]</a></li>
                    </ul>
                </li>
                <li>API:
                    <ul>
                        <li>API_V1:<a href="https://sos2122-10.herokuapp.com/api/v1/internet-population">[https://sos2122-10.herokuapp.com/api/v2/internet-population]</a></li>
                        <li>API_V2:<a href="https://sos2122-10.herokuapp.com/api/v2/internet-population">[https://sos2122-10.herokuapp.com/api/v2/internet-population]</a></li>
                    </ul>
                </li>
                <li>Front-end:
                    <ul>
                        <li> <a href="https://sos2122-10.herokuapp.com/#/internet-population">[https://sos2122-10.herokuapp.com/#/internet-population]</a></li>
                    </ul>
                </li>
            </ul>
            <br>
            (developed by <a href="https://github.com/germanblanco12">
            [Germán Blanco Pérez Victoria]</a>)</li>
    </ul>
    {#if errorC === 200.4}
        <UncontrolledAlert  color="success" >
			Datos cargados con éxito.
        </UncontrolledAlert>
    {/if}
    <div style="text-align: center;">
        <Button outline color="success" on:click="{LoadEntries}">
        CARGAR TODOS LOS DATOS
        </Button>
    </div>
    <br>

</main>