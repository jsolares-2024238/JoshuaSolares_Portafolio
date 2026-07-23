let barChart = null;
let donutCharts = [];

function readChartColors() {
  const styles = getComputedStyle(document.body);
  return {
    text: styles.getPropertyValue("--color-text").trim(),
    muted: styles.getPropertyValue("--color-text-muted").trim(),
    border: styles.getPropertyValue("--color-border").trim(),
    accent: styles.getPropertyValue("--color-accent").trim(),
  };
}

function buildCharts() {
  if (typeof Chart === "undefined") return;

  const colors = readChartColors();
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";

  if (barChart) barChart.destroy();
  donutCharts.forEach((chart) => chart.destroy());
  donutCharts = [];

  const centerTextPlugin = {
    id: "centerText",
    afterDraw(chart) {
      if (chart.config.type !== "doughnut") return;
      const { ctx, chartArea } = chart;
      const percent = chart.config.data.datasets[0].data[0];
      const x = (chartArea.left + chartArea.right) / 2;
      const y = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.font = "600 15px 'JetBrains Mono', monospace";
      ctx.fillStyle = colors.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${percent}%`, x, y);
      ctx.restore();
    },
  };

  const barCanvas = document.getElementById("langBarChart");
  if (barCanvas) {
    const labels = barCanvas.dataset.labels.split(",");
    const values = barCanvas.dataset.values.split(",").map(Number);

    barChart = new Chart(barCanvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors.accent,
            borderRadius: 4,
            barThickness: 20,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => `${ctx.formattedValue}%` },
          },
        },
        scales: {
          x: {
            min: 0,
            max: 100,
            ticks: { color: colors.muted, callback: (v) => `${v}%` },
            grid: { color: colors.border },
          },
          y: {
            ticks: { color: colors.text },
            grid: { display: false },
          },
        },
      },
    });
  }

  document.querySelectorAll(".skill-donut").forEach((canvas) => {
    const percent = Number(canvas.dataset.percent);

    const chart = new Chart(canvas, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [percent, 100 - percent],
            backgroundColor: [colors.accent, colors.border],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
      plugins: [centerTextPlugin],
    });

    donutCharts.push(chart);
  });
}

document.addEventListener("DOMContentLoaded", buildCharts);
document.addEventListener("themechange", buildCharts);
