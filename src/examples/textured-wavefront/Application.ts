import * as PULSAR from '../../Window';
import { ReflectionMappingScene } from './ReflectionMappingScene';

class Application {

    public main(): void {
        const window: PULSAR.Window = new PULSAR.Window('pulsar', 640, 360, new ReflectionMappingScene());
        window.start();
    }

}

new Application().main();
