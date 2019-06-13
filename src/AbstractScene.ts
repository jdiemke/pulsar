export abstract class AbstractScene {

    public abstract preload(): Promise<any>;

    public init(canvas: HTMLCanvasElement = null): void {
        // Do nothing
    }

    public abstract draw(): void;

}
