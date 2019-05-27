import * as PULSAR from '../../Window';
import { Scene } from './Scene';

class Application {

    public main(): void {
        const window: PULSAR.Window = new PULSAR.Window('pulsar', 640, 360);

        window.addScene(new Scene());
        window.start();
    }

}

new Application().main();
