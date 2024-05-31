// WIP
// Seleccion de idioma | por ahora no | traducir busqueda y resultado? API GOOGLE TRASLATE
// contador | limitar calls
// if count < 5 o 10 avisar ERROR avisar y otros errores
// agregar acreditacion
// esconder datos

// 10.000 calls por mes gratis
// URL base de la API de Edamam
// url AWS
const apiUrl = 'https://4td5d7t8sl.execute-api.eu-west-3.amazonaws.com/dev';

let recetasCargadas = [];

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
    const url = `${apiUrl}?q=${encodeURIComponent(nombreReceta)}`;
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

// Función para buscar receta aleatoria
const buscarRecetaRandom = async () => {
    // Generar una letra aleatoria del alfabeto
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));

    // Construir la URL de la solicitud GET con la letra como parámetro de consulta
    const url = `${apiUrl}?random=${randomLetter}`;

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