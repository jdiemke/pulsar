/**
 * Extend the Element and Document interfaces for cross browser fullscreen support
 */

interface Element {
    requestFullScreen?(): void;
    mozRequestFullScreen?(): void;
    webkitRequestFullScreen?(): void;
    msRequestFullscreen?(): void;

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
