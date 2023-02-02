<script context="module" lang="ts">
  import { getData } from './utils';
  import type { ItemData } from './types';
</script>

<script lang="ts">
  import Button from './ui/Button.svelte';
  import Input from './ui/Input.svelte';
  import Graph from './ui/Graph.svelte';

  const DATA_TYPES = {
    TEMP: 'temperature',
    PREC: 'precipitation',
  };

  const temperature = getData<ItemData>('../data/temperature.json');
  const precipitation = getData<ItemData>('../data/precipitation.json');

  let currentType = DATA_TYPES.TEMP;
  let data = temperature;

  const range = {
    min: 1881,
    max: 2006,
  };

  let min = 1881;
  let max = 2006;

  let onMaxChange = (event) => {
    if (event.detail < min) {
      max = min + 1;
    } else {
      max = event.detail;
    }
    setData();
  };

  let onMinChange = (event) => {
    if (event.detail > max) {
      min = max - 1;
    } else {
      min = event.detail;
    }
    setData();
  };

  let setData = (type = currentType) => {
    currentType = type;
    let source;

    if (type === DATA_TYPES.TEMP) {
      source = temperature;
    }
    if (type === DATA_TYPES.PREC) {
      source = precipitation;
    }

    data = source
      .then((values) => {
        return values.filter(({ t }) => {
          const year = Number(t.substring(0, 4));
          return year >= min && year <= max;
        });
      })
      .then((d) => {
        console.log(d);
        return d;
      });
  };
</script>

<main>
  <section>
    <div class="controls">
      <Button on:click={() => setData(DATA_TYPES.TEMP)}>Temperature</Button>
      <Button on:click={() => setData(DATA_TYPES.PREC)}>Precipitation</Button>
    </div>
    <div class="graph-container">
      <div class="filters">
        <Input {max} min={range.min} defaultValue={min} on:change={onMinChange} />
        <Input max={range.max} {min} defaultValue={max} on:change={onMaxChange} />
      </div>

      <div class="graph">
        {#await data}
          <p>waiting...</p>
        {:then res}
          <Graph data={res} />
        {:catch error}
          <p style="color: red">{error.message}</p>
        {/await}
      </div>
    </div>
  </section>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
  }

  section {
    display: flex;
    width: 650px;
    height: 400px;
  }

  .controls {
    box-sizing: border-box;
    width: max-content;
    height: 100%;
    padding: 4px;
  }

  div.controls > :global():first-child {
    margin-bottom: 4px;
  }

  .graph-container {
    display: flex;
    flex-direction: column;
    padding: 4px;
  }

  .filters {
    display: flex;
  }

  .graph {
    flex-grow: 1;
    width: 100%;
    margin-top: 4px;
    border: 1px solid var(--color-primary-5);
    border-radius: 4px;
  }
</style>
