export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { startVpsLivePoll } = await import(
    "./lib/euromillions/vps-live-poll"
  );
  startVpsLivePoll();
}
