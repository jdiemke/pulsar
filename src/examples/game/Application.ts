import * as PULSAR from '../../Window';
import { GameEngine } from './GameEngine';

class Application {

    public main(): void {
        const window: PULSAR.Window = new PULSAR.Window('pulsar', 640, 360, new GameEngine());

        this.addStartButtonToBody(window);
    }

    private addStartButtonToBody(window: PULSAR.Window): void {
        const button = document.createElement('button');
        button.innerText = 'Start Game';
        button.classList.add('button');
        button.addEventListener('click', () => {
            window.start();
        });

        document.body.appendChild(button)
    }

}

new Application().main();
