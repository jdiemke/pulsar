export abstract class AbstractScene {

    public abstract preload(): Promise<any>;

    public abstract init(): void;

    public abstract draw(): void;

}
