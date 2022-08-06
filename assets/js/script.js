let canvas;
const selectDivisas = document.querySelector("#select");
const api = `https://mindicador.cl/api/`;
const boton = document.querySelector("#boton");
let template = "";
const arreglo = [];
boton.addEventListener("click", function (e) {
  calcular();
  renderGrafica();
});
async function getDivisas() {
  const res = await fetch(`${api}${selectDivisas.value}`);
  const data = await res.json();
  return data;
}

async function calcular() {
  const monedas = await getDivisas();
  console.log(monedas);
  const valorMoneda = monedas.serie[0].valor;
  console.log(valorMoneda);

  let cantidad = document.querySelector("#cantidad");
  let resultado = Number(cantidad.value) / Number(valorMoneda);
  let total = document.querySelector("#resultado");
  total.innerHTML = resultado.toFixed(2);
}



//configuracion para graficos 

function prepararConfiguracionParaLaGrafica(monedas) {
  // Creamos las variables necesarias para el objeto de configuración
  if(canvas){
    canvas.destroy();
  }
  const tipoDeGrafica = "line";
  const historialMonedas = monedas.serie.slice(0,10);
  
  const titulo = "Historial de los ultimos 10 días.";
  const colorDeLinea = "red";
  const valores = historialMonedas.map((moneda) => moneda.valor);
  const fechas = historialMonedas.map((moneda) => {
    const fecha = new Date(moneda.fecha);
    return fecha.toLocaleDateString();
  });
  // Creamos el objeto de configuración usando las variables anteriores
  const config = {
    type: tipoDeGrafica,
    data: {
      labels: fechas,
      datasets: [
        {
          label: titulo,
          backgroundColor: colorDeLinea,
          data: valores,
        },
      ],
    },
  };
  return config;
}

//funcion para grafica

async function renderGrafica() {
  const monedas = await getDivisas();
  const config = prepararConfiguracionParaLaGrafica(monedas);
  const chartDOM = document.getElementById("myChart");
  canvas = new Chart(chartDOM, config);
}
