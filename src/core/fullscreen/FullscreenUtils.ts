export class FullscreenUtils {

    public static toggleFullscreen(element: Element): void {
        if (!this.fullscreen) {
            FullscreenUtils.enterFullscreen(element);
            this.fullscreen = true;
        } else {
            FullscreenUtils.exitFullscreen();
            this.fullscreen = false;
        }
    }

    public static enterFullscreen(element: Element): Promise<void> {
        if (element.requestFullscreen) {
            return element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            return element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            return element.msRequestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            return element.webkitRequestFullScreen();
        }
    }

    public static exitFullscreen(): void {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    private static fullscreen: boolean = false;

}
