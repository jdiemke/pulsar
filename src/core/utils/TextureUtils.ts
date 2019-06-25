import { Texture } from '../texture/Texture';
import { TextureFilterMode } from '../texture/TextureFilterMode';
import { TextureWrapMode } from '../texture/TextureWrapMode';

export class TextureUtils {

    public static load(filename: string): Promise<Texture> {
        return new Promise<HTMLImageElement>((resolve) => {
            const image: HTMLImageElement = new Image();
            image.src = filename;
            image.addEventListener('load', (ev: Event) => resolve(image));
        }).then((img: HTMLImageElement) => {
            const texture: Texture = new Texture();

            texture.setHTMLImageElementData(img);

            texture.setTextureMagFilter(TextureFilterMode.LINEAR);
            texture.setTextureMinFilter(TextureFilterMode.LINEAR);

            texture.setTextureWrapS(TextureWrapMode.REPEAT);
            texture.setTextureWrapT(TextureWrapMode.REPEAT);

            return texture;
        });
    }

}
