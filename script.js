const alertDanger    = document.querySelector('.alert-danger');
const formulario     = document.getElementById('formulario');
const opcionDesde    = document.getElementById('desde');
const opcionHasta    = document.getElementById('hasta');
const alertSuccess   = document.querySelector('.alert-light');
const templateMoneda = document.getElementById('templateMoneda').content;
const fragment       = document.createDocumentFragment();

// Variable global donde guarda los datos de la API
let conversionRates = {};

// Obtiene los códigos de las monedas
const obtenerCodigosMonedas = async () => {
    try {
        const respuesta = await fetch('https://v6.exchangerate-api.com/v6/71d4e40a6b47397986a47559/latest/USD');
        const datos     = await respuesta.json();
        
        conversionRates = datos.conversion_rates;
        colocarCodigos(datos);

    } catch (error) {
        console.log(error);
    }
}

// Coloca los códigos en los campos de opciones
const colocarCodigos = (datos) => {
    
    Object.keys(datos.conversion_rates).forEach((moneda) => {

        // Se crea un CLONE para DESDE
        const cloneDesde = templateMoneda.cloneNode(true);
        cloneDesde.querySelector('option').setAttribute('value', moneda);
        cloneDesde.querySelector('option').textContent = moneda;

        // Se crea otro CLONE para HASTA
        const cloneHasta = templateMoneda.cloneNode(true);
        cloneHasta.querySelector('option').setAttribute('value', moneda);
        cloneHasta.querySelector('option').textContent = moneda;
        
        opcionDesde.appendChild(cloneDesde);
        opcionHasta.appendChild(cloneHasta);
    });
}

// Calcula el monto
const calcularMonto = (monto, desde, hasta) => {
    const montoNumero = parseFloat(monto);
    const tasaDesde   = conversionRates[desde];
    const tasaHasta   = conversionRates[hasta];
    const resultado   = (monto * (tasaHasta / tasaDesde)).toFixed(2);
    
    // Agrega los datos calculados
    alertSuccess.querySelector('#montoDesde').textContent  = monto;
    alertSuccess.querySelector('#monedaDesde').textContent = desde;
    alertSuccess.querySelector('#montoHasta').textContent  = resultado;
    alertSuccess.querySelector('#monedaHasta').textContent = hasta;
    
    alertSuccess.querySelector('h1').textContent = `${resultado} ${hasta}`;

    // Muestra el resultado
    alertSuccess.classList.remove('d-none');
}


document.addEventListener("DOMContentLoaded", () => {
    obtenerCodigosMonedas();
})

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    alertDanger.classList.add('d-none');

    const datos = new FormData(formulario);
    const [monto, desde, hasta] = [...datos.values()];
    
    if (!monto.trim()) {
        console.log('Campo de monto vacío o inválido.');
        alertDanger.classList.remove('d-none');
        // En caso de error al ingresar otro monto, se oculta el resultado
        alertSuccess.classList.add('d-none');
        return;
    }

    calcularMonto(monto, desde, hasta);
})