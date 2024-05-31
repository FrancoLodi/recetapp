// WIP
// Seleccion de idioma | por ahora no | traducir busqueda y resultado? API GOOGLE TRASLATE
// contador | limitar calls
// if count < 5 o 10 avisar ERROR avisar y otros errores
// agregar acreditacion
// esconder datos

// 10.000 calls por mes gratis
// URL base de la API de Edamam
const apiUrl = 'https://api.edamam.com/search';

let recetasCargadas = [];

const axios = require('axios');

// URL de la función Lambda
const lambdaUrl = 'https://eu-west-3.console.aws.amazon.com/lambda/home?region=eu-west-3#/functions/RecetAppFunction';

// Función para obtener las variables de entorno desde la función Lambda
const getEnvironmentVariables = async () => {
    try {
        // Realiza una solicitud HTTP a la función Lambda
        const response = await axios.get(lambdaUrl);

        // Extrae las variables de entorno de la respuesta
        const { apiKey, appId } = response.data;

        // Almacena las variables de entorno en tus variables locales
        const app_id = appId;
        const app_key = apiKey;

        console.log('Variables de entorno obtenidas con éxito:', app_id, app_key);
    } catch (error) {
        console.error('Error al obtener las variables de entorno:', error.message);
    }
};

// Llama a la función para obtener y almacenar las variables de entorno
getEnvironmentVariables();


// Pantalla Buscar por receta
const pantallaBuscarPorReceta = () => {
    const header = document.querySelector('.titulo-header');
    header.classList.toggle('cambio-header');

    const menuPrincipal = document.querySelector('#menu-principal');
    menuPrincipal.innerHTML = `
        <div class="pantalla-buscar-receta">
            <p class="formulario-label">Search by Name or Ingredients</p>
            <form id="formulario" class="formulario">
                <input type="text" placeholder="Pizza, tomato, cheese..." name="buscador" id="buscador" class="barra-busqueda">
                <button type="submit" id="search" class="search-button">
                    <i class="fas fa-search"></i>
                </button>
            </form>
            <div id="listado" class="listado-recetas"></div>
        </div>
    `;

    const formulario = document.querySelector("#formulario");
    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const informacion = new FormData(evento.target);
        const submit = Object.fromEntries(informacion);
        const busqueda = submit.buscador;
        await buscarReceta(busqueda);
        const labelFormulario = document.querySelector(".formulario-label");
        if (labelFormulario){
            labelFormulario.classList.toggle('cambio-label');
        }
    });
};

// Función para buscar recetas
const buscarReceta = async (nombreReceta) => {
    const url = `${apiUrl}?q=${encodeURIComponent(nombreReceta)}&app_id=${appId}&app_key=${apiKey}&from=0&to=30`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('No se pudo obtener la lista de recetas');
        const data = await response.json();
        mostrarRecetas(data.hits);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Función para mostrar las recetas
const mostrarRecetas = (recetas) => {
    recetasCargadas = recetas;
    const lista = document.querySelector('#listado');
    lista.innerHTML = '';
    recetas.slice(0, 5).forEach((item, index) => {
        lista.appendChild(crearTarjetaReceta(item.recipe));
    });
    agregarBotonMostrarMas();
};

// Función para crear tarjeta de receta
const crearTarjetaReceta = (receta) => {
    const tarjetaReceta = document.createElement('div');
    tarjetaReceta.classList.add('tarjeta-receta');
    tarjetaReceta.innerHTML = `
        <img class="tarjeta-receta-img" src="${receta.image}" alt="Foto de la receta">
        <div class="tarjeta-info">
            <div class="tarjeta-receta-txt">
                <p class="tarjeta-titulo-receta">${receta.label}</p>
                <p class="tarjeta-ingredientes-lista">${receta.ingredientLines.join('<br>')}</p>
            </div>
            <a href="${receta.url}" target="_blank"><button class="boton-ver-receta">View recipe</button></a>
        </div>
    `;
    return tarjetaReceta;
};

// Función para agregar botón "Mostrar más"
const agregarBotonMostrarMas = () => {
    const pantallaBuscar = document.querySelector('.pantalla-buscar-receta');
    const botonMostrarMasExistente = document.querySelector('.boton-mostrar-mas');
    if (botonMostrarMasExistente) {
        botonMostrarMasExistente.remove();
    }
    const botonMostrarMas = document.createElement('button');
    botonMostrarMas.classList.add('boton-mostrar-mas');
    botonMostrarMas.innerText = 'Show more';
    botonMostrarMas.addEventListener('click', mostrarMasRecetas);
    pantallaBuscar.appendChild(botonMostrarMas);
};

// Función para mostrar más recetas
const mostrarMasRecetas = () => {
    const lista = document.querySelector('#listado');
    const currentLength = lista.children.length;
    const nextLength = currentLength + 5;

    recetasCargadas.slice(currentLength, nextLength).forEach((item) => {
        lista.appendChild(crearTarjetaReceta(item.recipe));
    });

    // Volver a agregar el botón "Show more" si hay más recetas disponibles
    if (nextLength < recetasCargadas.length) {
        agregarBotonMostrarMas();
    }
};

// Pantalla Receta Random
const pantallaRecetaRandom = () => {
    const header = document.querySelector('.titulo-header');
    header.classList.toggle('cambio-header');
    
    const menuPrincipal = document.querySelector('#menu-principal');
    menuPrincipal.innerHTML = `
        <div class="pantalla-buscar-receta">
            <button id="boton-shuffle" class="boton-shuffle">Shuffle again</button>
            <div id="listado" class="listado-recetas"></div>
        </div>
    `;
    buscarRecetaRandom(); // Llama a buscarRecetaRandom para obtener recetas aleatorias
    // Boton shuffle again
    const botonShuffleAgain = document.querySelector("#boton-shuffle");
    botonShuffleAgain.addEventListener("click", buscarRecetaRandom)
};

// Función para buscar receta random - generando una letra aleatoria
const buscarRecetaRandom = async () => {
    // Generar un número aleatorio entre 0 y 25 (inclusive)
    const randomIndex = Math.floor(Math.random() * 26);
    console.log(randomIndex);
    // Convertir el número en una letra del alfabeto (a: 0, b: 1, ..., z: 25)
    const randomLetter = String.fromCharCode(97 + randomIndex);
    console.log(randomLetter);
    // Construir la URL de la solicitud GET con la letra como parámetro de consulta
    const url = `${apiUrl}?q=${randomLetter}&app_id=${appId}&app_key=${apiKey}&from=0&to=30&random=true`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('No se pudo obtener la lista de recetas');
        const data = await response.json();
        mostrarRecetas(data.hits);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Botón buscar por receta
document.querySelector('#boton-buscar-receta').addEventListener("click", pantallaBuscarPorReceta);

// Botón buscar receta random
document.querySelector('#boton-receta-random').addEventListener("click", pantallaRecetaRandom);