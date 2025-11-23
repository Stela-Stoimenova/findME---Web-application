document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("visitsCanvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});
