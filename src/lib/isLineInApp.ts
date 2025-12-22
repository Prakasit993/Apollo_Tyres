export function isLineInApp() {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || "";
    return /Line/i.test(ua);
}
