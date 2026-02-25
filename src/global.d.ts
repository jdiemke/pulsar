/**
 * Extend the Element and Document interfaces for cross browser fullscreen support
 */

interface Element {
    requestFullScreen?(): Promise<void>;
    mozRequestFullScreen?(): Promise<void>;
    webkitRequestFullScreen?(): Promise<void>;
    msRequestFullscreen?(): Promise<void>;

    mozRequestPointerLock?(): void;
    webkitRequestPointerLock?(): void;
}

interface Document {
    mozCancelFullScreen?(): void;
    webkitExitFullscreen?(): void;

    mozExitPointerLock?(): void;
    webkitExitPointerLock?(): void;
}

declare const BUILD_TIME: string;
