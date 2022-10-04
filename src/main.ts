import './style.css';
import { getData } from './utils';
import type { ItemData } from './types';

document.addEventListener('DOMContentLoaded', async () => {
    const temperature = await getData<ItemData>('../data/temperature.json');
    const precipitation = await getData<ItemData>('../data/precipitation.json');

    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div>
            <div>
                Temperature data length: ${temperature.length}
                <details>
                    <summary>Temperature</summary>
                    ${JSON.stringify(temperature)}
                </details>
            </div>
            <br>
            <div>
                Precipitation data length: ${precipitation.length}
                <details>
                    <summary>Precipitation</summary>
                    ${JSON.stringify(precipitation)}
                </details>
            </div>
        </div>
    `;
});
