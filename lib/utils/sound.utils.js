export const playBeep = () => {
    const audio = new Audio("/new-notification.mp3"); // or .wav, .ogg
    audio.play().catch((e) => console.log("Audio play failed:", e));
};
