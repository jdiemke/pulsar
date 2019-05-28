import { AbstractScene } from './AbstractScene';
import { FullscreenUtils } from './core/fullscreen/FullscreenUtils';
import { Logger } from './core/Logger';
import * as RenderingContext from './core/RenderingContext';
import { context as gl } from './core/RenderingContext';

export class Window {

    private logger: Logger = new Logger('Window');
    private scene: AbstractScene;

    public constructor(elementId: string, private width: number, private height: number,
                       scene?: AbstractScene) {
        this.scene = scene;
        const canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById(elementId);
        canvas.width = width;
        canvas.height = height;
        const contextAttributes: WebGLContextAttributes = {
            antialias: true
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
            FullscreenUtils.toggleFullscreen(canvas);
        });

        this.draw = this.draw.bind(this);
    }

    public addScene(scene: AbstractScene): void {
        this.scene = scene;
    }

    public start(): void {
        this.scene.preload().then(() => {
            this.defaultInitialization();
            this.scene.init();
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
