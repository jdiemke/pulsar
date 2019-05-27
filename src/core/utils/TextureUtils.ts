import { Texture } from '../texture/Texture';

export class TextureUtils {

    public static load(filename: string): Promise<Texture> {
        return new Promise<HTMLImageElement>((resolve) => {
            const image: HTMLImageElement = new Image();
            image.src = filename;
            image.addEventListener('load', (ev: Event) => resolve(image));
        }).then((img: HTMLImageElement) => new Texture(img));
    }

}
