export class Logger {

    private context: string;

    constructor(context?: string) {
        this.context = this.padEnd((context ? context : ''), 20, ' ');
    }

    public info(message: any, ...optionalParams: Array<any>): void {
        console.info(new Date().toISOString(), 'INFO', '[' + this.context + ']', '      ', ':', message, ...optionalParams);
    }

    public measure(time: number, message: any, ...optionalParams: Array<any>): void {
        console.info(
            new Date().toISOString(),
            'INFO',
            '[' + this.context + ']',
            this.padStart(time.toString() + ' ms', 6, ' '), ':', message, ...optionalParams
        );
    }

    public padEnd(text: string, targetLength: number, padString: string): string {
        const paddingValue: string = padString.repeat(targetLength);
        return String(text + paddingValue).slice(0, paddingValue.length);
    }

    public padStart(text: string, targetLength: number, padString: string): string {
        const paddingValue: string = padString.repeat(targetLength);
        return String(paddingValue + text).slice(-paddingValue.length);
    }

}

export const logger: Logger = new Logger();
