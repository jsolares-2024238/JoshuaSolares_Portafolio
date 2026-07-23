document.addEventListener("DOMContentLoaded", () => {
  if (typeof Chart === "undefined") return;

  const styles = getComputedStyle(document.body);
  const colorText = styles.getPropertyValue("--color-text").trim();
  const colorMuted = styles.getPropertyValue("--color-text-muted").trim();
  const colorBorder = styles.getPropertyValue("--color-border").trim();
  const colorPrimary = styles.getPropertyValue("--color-primary").trim();
  const colorAccent = styles.getPropertyValue("--color-accent").trim();

  const centerTextPlugin = {
    id: "centerText",
    afterDraw(chart) {
      if (chart.config.type !== "doughnut") return;
      const { ctx, chartArea } = chart;
      const percent = chart.config.data.datasets[0].data[0];
      const x = (chartArea.left + chartArea.right) / 2;
      const y = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.font = "700 16px Segoe UI, sans-serif";
      ctx.fillStyle = colorText;
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

    new Chart(barCanvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colorPrimary,
            borderRadius: 6,
            barThickness: 22,
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
            ticks: { color: colorMuted, callback: (v) => `${v}%` },
            grid: { color: colorBorder },
          },
          y: {
            ticks: { color: colorText },
            grid: { display: false },
          },
        },
      },
    });
  }

  document.querySelectorAll(".skill-donut").forEach((canvas) => {
    const percent = Number(canvas.dataset.percent);

    new Chart(canvas, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [percent, 100 - percent],
            backgroundColor: [colorAccent, colorBorder],
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
  });
});
