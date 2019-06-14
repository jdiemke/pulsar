export class Keyboard {

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

    public isDown(code: Key): boolean {
        return this.pressed[code];
    }

    public onKeyDown(event: KeyboardEvent): void {
        this.pressed[event.keyCode] = true;
    }

    public onKeyUp(event: KeyboardEvent): void {
        this.pressed[event.keyCode] = false;
    }

}

export enum Key {
    LEFT = 37,
    UP = 38,
    RIGHT= 39,
    DOWN = 40,
    A = 65,
    D = 68,
    L= 76,
    W = Keyboard.getCode('W'),
    S = Keyboard.getCode('S')
}
