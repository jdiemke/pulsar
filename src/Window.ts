import { AbstractScene } from './AbstractScene';
import { FullscreenUtils } from './core/fullscreen/FullscreenUtils';
import { Logger } from './core/Logger';
import * as RenderingContext from './core/RenderingContext';
import { context as gl } from './core/RenderingContext';
import { PointerLockUtils } from './core/fullscreen/PointerLockUtils';

export class Window {

    private logger: Logger = new Logger('Window');
    private scene: AbstractScene;
    private canvas: HTMLCanvasElement;

    public constructor(elementId: string, private width: number, private height: number,
        scene?: AbstractScene) {

        this.scene = scene;
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(elementId);
        canvas.width = width;
        canvas.height = height;

        canvas.style.cssText = 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
            'image-rendering: -moz-crisp-edges;' + // FireFox
            'image-rendering: -o-crisp-edges;' +  // Opera
            'image-rendering: -webkit-crisp-edges;' + // Chrome
            'image-rendering: crisp-edges;' + // Chrome
            'image-rendering: -webkit-optimize-contrast;' + // Safari
            'image-rendering: pixelated; ' + // Future browsers
            '-ms-interpolation-mode: nearest-neighbor;'; // IE

        const contextAttributes: WebGLContextAttributes = {
            antialias: true,
            premultipliedAlpha: false
        };

        const renderingContext: WebGL2RenderingContext = canvas.getContext('webgl2', contextAttributes);

        if (renderingContext === null) {
            throw new Error('Could not initialize WebGL rendering context.');
        }

        this.logger.info('WebGL2RenderingContext: ', renderingContext);
        this.logger.info('WebGLContextAttributes: ', renderingContext.getContextAttributes());

        RenderingContext.setCurrentContext(renderingContext);

        canvas.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            FullscreenUtils.enterFullscreen(canvas);
            PointerLockUtils.requestLock(canvas);
        });

        this.logger.info('Pointer Lock:', PointerLockUtils.isAvailable());

        this.draw = this.draw.bind(this);
        this.canvas = canvas;
        this.logger.info('BUILD DATE:', BUILD_TIME);
    }

    public addScene(scene: AbstractScene): void {
        this.scene = scene;
    }

    public start(): void {
        this.scene.preload().then(() => {
            this.defaultInitialization();
            this.scene.init(this.canvas);
            this.draw();
        });
    }

    private defaultInitialization(): void {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.viewport(0, 0, this.width, this.height);
    }

    private draw(): void {
        this.scene.draw();
        requestAnimationFrame(this.draw);
    }

}
