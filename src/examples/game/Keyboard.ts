export class Keyboard {

    public static LEFT: number = 37;
    public static UP: number = 38;
    public static RIGHT: number = 39;
    public static DOWN: number = 40;
    public static KEY_A: number = 65;
    public static KEY_D: number = 68;
    public static KEY_L: number = 76;
    public static KEY_W: number = Keyboard.getCode('W');
    public static KEY_S: number = Keyboard.getCode('S');

    public static getCode(key: string): number {
        return key.charCodeAt(0);
    }

    private pressed: Array<boolean>;

    constructor() {
        this.pressed = new Array<boolean>(256);
        this.pressed.fill(false);

        window.addEventListener('keyup', (event: KeyboardEvent) => this.onKeyUp(event), false);
        window.addEventListener('keydown', (event: KeyboardEvent) => this.onKeyDown(event), false);
    }

    public isDown(code: number): boolean {
        return this.pressed[code];
    }

    public onKeyDown(event: KeyboardEvent): void {
        this.pressed[event.keyCode] = true;
    }

    public onKeyUp(event: KeyboardEvent): void {
        this.pressed[event.keyCode] = false;
    }

}
