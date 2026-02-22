import * as PULSAR from '../../Window';
import { GameEngine } from './GameEngine';

class Application {

    public main(): void {
        const window: PULSAR.Window = new PULSAR.Window('pulsar', 640, 360, new GameEngine());
        window.start();
    }

}

new Application().main();
