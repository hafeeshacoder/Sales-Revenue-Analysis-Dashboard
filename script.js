let data = salesData;

function init() {
  populateFilter();
  updateDashboard("All");
}

function populateFilter() {
  const regions = [...new Set(data.map(d => d.region))];
  const filter = document.getElementById("regionFilter");

  regions.forEach(r => {
    let opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    filter.appendChild(opt);
  });

  filter.addEventListener("change", (e) => {
    updateDashboard(e.target.value);
  });
}

function updateDashboard(region) {
  let filtered = region === "All" ? data : data.filter(d => d.region === region);

  let totalSales = filtered.reduce((sum, d) => sum + d.quantity, 0);
  let totalRevenue = filtered.reduce((sum, d) => sum + (d.quantity * d.price), 0);

  document.getElementById("totalSales").innerText = totalSales;
  document.getElementById("totalRevenue").innerText = "₹" + totalRevenue;

  let productMap = {};
  filtered.forEach(d => {
    productMap[d.product] = (productMap[d.product] || 0) + (d.quantity * d.price);
  });

  let topProduct = Object.keys(productMap).reduce((a, b) =>
    productMap[a] > productMap[b] ? a : b
  );

  document.getElementById("topProduct").innerText = topProduct;

  drawCharts(filtered);
  generateInsights(filtered, totalRevenue, topProduct);
}

function drawCharts(filtered) {
  let dates = filtered.map(d => d.date);
  let revenue = filtered.map(d => d.quantity * d.price);

  if (window.revenueChart) revenueChart.destroy();

  window.revenueChart = new Chart(document.getElementById("revenueChart"), {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: "Revenue",
        data: revenue
      }]
    }
  });

  let productMap = {};
  filtered.forEach(d => {
    productMap[d.product] = (productMap[d.product] || 0) + d.quantity;
  });

  if (window.productChart) productChart.destroy();

  window.productChart = new Chart(document.getElementById("productChart"), {
    type: 'bar',
    data: {
      labels: Object.keys(productMap),
      datasets: [{
        label: "Sales",
        data: Object.values(productMap)
      }]
    }
  });
}

/* 🔥 INSIGHTS GENERATOR */
function generateInsights(filtered, totalRevenue, topProduct) {
  const insights = document.getElementById("insightsList");
  insights.innerHTML = "";

  insights.innerHTML += `<li>Total revenue generated is ₹${totalRevenue}</li>`;
  insights.innerHTML += `<li>Top-performing product is <b>${topProduct}</b></li>`;

  let regions = {};
  filtered.forEach(d => {
    regions[d.region] = (regions[d.region] || 0) + (d.quantity * d.price);
  });

  let bestRegion = Object.keys(regions).reduce((a, b) =>
    regions[a] > regions[b] ? a : b
  );

  insights.innerHTML += `<li>Highest revenue comes from <b>${bestRegion}</b> region</li>`;
}

init();
