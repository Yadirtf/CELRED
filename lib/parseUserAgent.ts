/**
 * Lightweight User-Agent parser — no external dependencies.
 * Covers ~95% of common browsers and OS combinations.
 */

interface ParsedUA {
    device: 'Mobile' | 'Tablet' | 'Desktop';
    browser: string;
    os: string;
}

function detectDevice(ua: string): 'Mobile' | 'Tablet' | 'Desktop' {
    if (/iPad|tablet|Kindle|PlayBook/i.test(ua)) return 'Tablet';
    if (/Android(?!.*\bMobile\b)/i.test(ua) && /Android/i.test(ua)) {
        // Android without "Mobile" keyword often means tablet
        // But many phones also omit it, so check screen-related hints
        if (!/Mobile/i.test(ua)) return 'Tablet';
    }
    if (/Mobile|iPhone|iPod|Android.*Mobile|webOS|BlackBerry|Opera Mini|IEMobile/i.test(ua)) {
        return 'Mobile';
    }
    return 'Desktop';
}

function detectBrowser(ua: string): string {
    // Order matters: check specific browsers before generic engines

    // Samsung Internet
    const samsung = ua.match(/SamsungBrowser\/([\d.]+)/);
    if (samsung) return `Samsung Internet ${samsung[1]}`;

    // Edge (Chromium-based)
    const edg = ua.match(/Edg(?:e|A|iOS)?\/([\d.]+)/);
    if (edg) return `Edge ${edg[1].split('.')[0]}`;

    // Opera / OPR
    const opera = ua.match(/(?:OPR|Opera)\/([\d.]+)/);
    if (opera) return `Opera ${opera[1].split('.')[0]}`;

    // Brave (identifies as Chrome but has "Brave" in the UA sometimes)
    if (/Brave/i.test(ua)) {
        const braveVer = ua.match(/Brave\/([\d.]+)/);
        return braveVer ? `Brave ${braveVer[1].split('.')[0]}` : 'Brave';
    }

    // Firefox
    const firefox = ua.match(/Firefox\/([\d.]+)/);
    if (firefox) return `Firefox ${firefox[1].split('.')[0]}`;

    // Chrome (must be after Edge, Opera, Samsung, Brave which also have "Chrome")
    const chrome = ua.match(/Chrome\/([\d.]+)/);
    if (chrome && !/Chromium/.test(ua)) return `Chrome ${chrome[1].split('.')[0]}`;

    // Safari (must be after Chrome since Chrome also has "Safari")
    const safari = ua.match(/Version\/([\d.]+).*Safari/);
    if (safari) return `Safari ${safari[1].split('.')[0]}`;

    // Chromium
    const chromium = ua.match(/Chromium\/([\d.]+)/);
    if (chromium) return `Chromium ${chromium[1].split('.')[0]}`;

    // WebView / In-App browsers
    if (/FBAN|FBAV|Instagram|Twitter|LinkedIn/i.test(ua)) return 'In-App Browser';

    return 'Otro';
}

function detectOS(ua: string): string {
    // iOS
    const ios = ua.match(/OS (\d+[_\.]\d+)/);
    if (/iPhone|iPad|iPod/.test(ua) && ios) {
        return `iOS ${ios[1].replace('_', '.')}`;
    }

    // Android
    const android = ua.match(/Android ([\d.]+)/);
    if (android) return `Android ${android[1]}`;

    // Windows
    if (/Windows NT 10/.test(ua)) return 'Windows 10/11';
    if (/Windows NT 6\.3/.test(ua)) return 'Windows 8.1';
    if (/Windows NT 6\.2/.test(ua)) return 'Windows 8';
    if (/Windows NT 6\.1/.test(ua)) return 'Windows 7';
    if (/Windows/.test(ua)) return 'Windows';

    // macOS
    const mac = ua.match(/Mac OS X (\d+[_\.]\d+)/);
    if (mac) return `macOS ${mac[1].replace('_', '.')}`;
    if (/Macintosh/.test(ua)) return 'macOS';

    // Linux
    if (/Ubuntu/i.test(ua)) return 'Ubuntu';
    if (/Linux/i.test(ua)) return 'Linux';

    // Chrome OS
    if (/CrOS/i.test(ua)) return 'Chrome OS';

    return 'Otro';
}

export function parseUserAgent(ua: string | null | undefined): ParsedUA {
    if (!ua) {
        return { device: 'Desktop', browser: 'Desconocido', os: 'Desconocido' };
    }

    return {
        device: detectDevice(ua),
        browser: detectBrowser(ua),
        os: detectOS(ua),
    };
}
