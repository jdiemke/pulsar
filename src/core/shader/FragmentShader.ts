import { context as gl } from '../RenderingContext';
import { AbstractShader } from './AbstractShader';

export class FragmentShader extends AbstractShader {

    protected getType(): number {
        return gl.FRAGMENT_SHADER;
    }

}
