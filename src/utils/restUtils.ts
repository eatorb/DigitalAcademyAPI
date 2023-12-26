export function antiSQLInjection(input:string): string {
    input = replaceAll(input, "'", "''");
    input = replaceAll(input, "\\", "\\\\");
    input = replaceAll(input, "\0", "\\0");
    input = replaceAll(input, "\n", "\\n");
    input = replaceAll(input, "\r", "\\r");
    input = replaceAll(input, "\"", "\\\"");
    input = replaceAll(input, "\\x1a", "\\Z");

    return input;
}

export function isSQLInjections(...input: string[]): boolean {
    for (let i = 0; i < input.length; i++) {
        if(isSQLInjection(input[i])) return true;
    }
    return false;
}

export function isSQLInjection(input: string): boolean {
    const replacements = [
        "'",
        "\\",
        "\0",
        "\n",
        "\r",
        "\"",
        "\\x1a",
    ];

    for (const item of replacements) {
        if (input.includes(item)) {
            return true;
        }
    }

    return false;
}

export function generateRandomString(length: number = 256, characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function escapeRegExp(str:any) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceAll(str:any, find:any, replace:any) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export function utf8_to_latin1(str:any) {
    return unescape(encodeURIComponent(str));
};
export function latin1_to_utf8(str:any) {
    return decodeURIComponent(escape(str));
};

export function formatUptime(seconds: number): string {
    function pad(s: any) {
        return (s < 10 ? '0' : '') + s;
    }
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor(seconds % (24 * 60 * 60) / (60 * 60));
    const minutes = Math.floor(seconds % (60 * 60) / 60);
    const secs = Math.floor(seconds % 60);

    return `${pad(days)}D:${pad(hours)}H:${pad(minutes)}M:${pad(secs)}S`;
}

export default {generateRandomString, antiSQLInjection, isSQLInjections, utf8_to_latin1, latin1_to_utf8, replaceAll}