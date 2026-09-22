/**
 * A little confetti burst for a "great" tracing score. Dynamically
 * imported so `canvas-confetti` (which touches the DOM) never ends up in
 * the server bundle and only loads the moment it's actually needed.
 */
export async function celebrate() {
  const { default: confetti } = await import("canvas-confetti");

  const colors = ["#7c3aed", "#c026d3", "#facc15", "#38bdf8", "#4ade80"];

  confetti({
    particleCount: 90,
    spread: 75,
    startVelocity: 38,
    origin: { y: 0.6 },
    colors,
    ticks: 200,
  });

  // A second, smaller burst a beat later reads as more of a "celebration"
  // than one flat particle cloud.
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      startVelocity: 25,
      origin: { y: 0.5 },
      colors,
      scalar: 0.8,
      ticks: 180,
    });
  }, 180);
}
