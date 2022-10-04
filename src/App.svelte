<script context="module" lang="ts">
    import { getData } from './utils';
    import type { ItemData } from './types';
</script>

<script lang="ts">
    const temperature = getData<ItemData>('../data/temperature.json');
    const precipitation = getData<ItemData>('../data/precipitation.json');
</script>

<main>
    {#await temperature}
        <p>waiting...</p>
    {:then res}
        <div>
            Temperature data length: {res.length}
            <details>
                <summary>Temperature</summary>
                {JSON.stringify(res)}
            </details>
        </div>
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}

    <br>

    {#await precipitation}
        <p>waiting...</p>
    {:then res}
        <div>
            Precipitation data length: {res.length}
            <details>
                <summary>Precipitation</summary>
                {JSON.stringify(res)}
            </details>
        </div>
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
</main>

<style>
    
</style>