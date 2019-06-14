/**
 * https://www.html5rocks.com/en/tutorials/pointerlock/intro/
 */
export class PointerLockUtils {

    public static isAvailable(): boolean {
        return 'pointerLockElement' in document;
    }

    public static requestLock(element: Element): void {
        element.requestPointerLock();
    }

    public static releaseLock(): void {
        document.exitPointerLock();
    }

}
