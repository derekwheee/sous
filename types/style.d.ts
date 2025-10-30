interface Swatch {
    blue: string;
    yellow: string;
    purple: string;
    green: string;
    pink: string;
    success: string;
    warning: string;
    info: string;
    error: string;
    c: string;
    m: string;
    y: string;
    k: string;
}

interface Palette extends Swatch {
    sous: string;
    primary: string;
    background: string;
    text: string;
    indeterminate: string;
    surface: string;
}
