// Dados simulados
const baseData = {
  meses: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
  receita: [12000,13500,12800,14200,15500,14900,16000,17000,16500,18000,19000,21000],
  pedidos: { "Espresso": 520, "Latte": 310, "Cappuccino": 220, "Mocha": 180 },
  clientes: [35,40,42,38,45,48,52,55,58,60,62,70]
};

// KPIs
function formatBRL(v){ return v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'}); }
function atualizarKPIs(range=12){
  const r = baseData.receita.slice(12-range);
  const pTotal = Object.values(baseData.pedidos).reduce((a,b)=>a+b,0);
  const receitaTotal = r.reduce((a,b)=>a+b,0);
  const pedidos = pTotal; // simplificado
  const ticket = receitaTotal / pedidos;
  const clientes = baseData.clientes.slice(12-range).reduce((a,b)=>a+b,0);

  document.getElementById('kpi-receita').textContent = formatBRL(receitaTotal);
  document.getElementById('kpi-pedidos').textContent = pedidos.toLocaleString('pt-BR');
  document.getElementById('kpi-ticket').textContent = formatBRL(ticket);
  document.getElementById('kpi-clientes').textContent = clientes.toLocaleString('pt-BR');
}

// Gráficos
let chartReceita, chartCategorias, chartClientes;

function renderCharts(range=12){
  const ctx1 = document.getElementById('chartReceita').getContext('2d');
  const ctx2 = document.getElementById('chartCategorias').getContext('2d');
  const ctx3 = document.getElementById('chartClientes').getContext('2d');

  const labels = baseData.meses.slice(12-range);
  const receita = baseData.receita.slice(12-range);
  const clientes = baseData.clientes.slice(12-range);

  if(chartReceita) chartReceita.destroy();
  if(chartCategorias) chartCategorias.destroy();
  if(chartClientes) chartClientes.destroy();

  chartReceita = new Chart(ctx1, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Receita', data: receita, tension:.35, fill:true }]},
    options: { responsive:true, plugins:{ legend:{ display:false } } }
  });

  chartCategorias = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: Object.keys(baseData.pedidos),
      datasets: [{ label: 'Pedidos', data: Object.values(baseData.pedidos) }]
    },
    options: { responsive:true, plugins:{ legend:{ display:false } } }
  });

  chartClientes = new Chart(ctx3, {
    type: 'pie',
    data: { labels, datasets: [{ data: clientes }]},
    options: { responsive:true }
  });
}

function init(){
  const select = document.getElementById('select-periodo');
  atualizarKPIs(parseInt(select.value));
  renderCharts(parseInt(select.value));

  select.addEventListener('change', e => {
    const r = parseInt(e.target.value);
    atualizarKPIs(r);
    renderCharts(r);
  });

  // Tema claro/escuro
  const toggle = document.getElementById('toggle-tema');
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
  });
}

document.addEventListener('DOMContentLoaded', init);
