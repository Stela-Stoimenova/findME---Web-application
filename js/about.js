// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get the canvas element
  const canvas = document.getElementById("visitsCanvas");
  if (!canvas) return; // Exit if canvas is not found

  const ctx = canvas.getContext("2d");
  const visits = [12, 25, 18, 40, 35, 50, 42]; 
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const barWidth = 35;
  const barSpacing = 20;
  const maxHeight = canvas.height - 20;

  visits.forEach((value, i) => {
    const barHeight = (value / Math.max(...visits)) * maxHeight;
    const x = i * (barWidth + barSpacing) + 10;
    const y = canvas.height - barHeight - 10;

    ctx.fillStyle = "#e24a5eff";
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "#000";
    ctx.font = "10px Arial";
    ctx.fillText(days[i], x, canvas.height - 2);
  });
});
