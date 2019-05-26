import { context as gl } from '../core/RenderingContext';
import { AbstractShader } from './AbstractShader';

export class VertexShader extends AbstractShader {

    protected getType(): number {
        return gl.VERTEX_SHADER;
    }

}
