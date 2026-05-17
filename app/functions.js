export function getFilename(path) {
    if (typeof path !== "string") return "";
    return path.substring(path.lastIndexOf("/") + 1);
}

export function formatDate(date) {
    if (typeof date !== "string") return "";
    return new Date(date).toLocaleDateString();
}

export function addPeriodToDate(baseDate, period) {
    const date = new Date(baseDate);
    const [number, unit] = period.split(" ");
    const num = parseInt(number);
    const unitFormatted = unit.toLowerCase().replace(/s$/, ""); // Remove trailing 's'

    switch (unitFormatted) {
        case "day":
            date.setDate(date.getDate() + num);
            break;
        case "week":
            date.setDate(date.getDate() + num * 7);
            break;
        case "month":
            date.setMonth(date.getMonth() + num);
            break;
        case "year":
            date.setFullYear(date.getFullYear() + num);
            break;
        default:
            throw new Error(`Invalid time unit: ${unit}`);
    }

    return date.toISOString();
}

export function summarize(text) {
    if (typeof text !== "string") return "";
    return text.length > 110 ? text.slice(0, 110) + "..." : text;
}
