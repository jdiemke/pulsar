import { Logger } from '../core/Logger';
import { Mesh } from './mesh';
import { convertToMeshArray } from './parseUtils';

export class WavefrontLoader {

    public static load(filename: string): Promise<Array<Mesh>> {
        const startTime: number = Date.now();

        return fetch(filename).then((response: Response) => {
            return response.text();
        }).then((text: string): Array<Mesh> => {
            return convertToMeshArray(text);
        }).finally(() => {
            const elapsedTime: number = (Date.now() - startTime);
            WavefrontLoader.logger.measure(elapsedTime, 'Finished loading model', filename);
        });
    }

    private static logger: Logger = new Logger(WavefrontLoader.name);

    private constructor() {

    }

}
