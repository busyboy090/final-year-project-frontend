/**
     * Enhanced Formatter
     * Handles: "2d 5h", "4h 20m", "5:30", or "0:45"
     */
export const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "";

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (days > 0) {
        return `${days}d ${hours}h`;
    }
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    // Standard M:SS for anything under an hour
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};