// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get the canvas element
  const canvas = document.getElementById("visitsCanvas");
  if (!canvas) return; // Exit if canvas is not found

  const ctx = canvas.getContext("2d");
  const visits = [12, 25, 18, 40, 35, 50, 42]; 
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const barWidth = 40;
  const barSpacing = 25;
  const maxHeight = canvas.height - 60;
  const maxVisits = Math.max(...visits);

  // Draw bars with gradient
  visits.forEach((value, i) => {
    const barHeight = (value / maxVisits) * maxHeight;
    const x = i * (barWidth + barSpacing) + 30;
    const y = canvas.height - barHeight - 40;

    // Create gradient for each bar
    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, "#e24a5e");
    gradient.addColorStop(0.5, "#f39c6b");
    gradient.addColorStop(1, "#4A90E2");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);

    // Draw day labels
    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(days[i], x + barWidth / 2, canvas.height - 20);
    
    // Draw visit numbers on top of bars
    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillText(value, x + barWidth / 2, y - 5);
  });
  
  // Draw title
  ctx.fillStyle = "#2c3e50";
  ctx.font = "bold 14px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Daily Visits", canvas.width / 2, 20);
});
