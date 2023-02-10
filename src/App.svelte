<script context="module" lang="ts">
  import { getData, addData, fetchData, Table } from './utils';
  import type { DataSources, ItemData } from './types';
</script>

<script lang="ts">
  import Button from './ui/Button.svelte';
  import Input from './ui/Input.svelte';
  import Graph from './ui/Graph.svelte';

  // store data in local variables to prevent multiple requests to indexedDB
  const dataSources: DataSources = {
    [Table.Temperature]: [],
    [Table.Precipitation]: [],
  };

  const urls = {
    [Table.Temperature]: '../data/temperature.json',
    [Table.Precipitation]: '../data/precipitation.json',
  };

  let currentType: Table = Table.Temperature;
  let data: ItemData[];

  const range = {
    min: 1881,
    max: 2006,
  };

  let min = 1881;
  let max = 2006;

  /**
   * Checks for data in indexedDB, fetch data and add it to indexedDB if there is no data in indexedDB
   * @param table table name in indexedDB
   * @param url url to fetch new data
   */
  const loadData = (table: Table, url: string) =>
    getData<ItemData>(table)
      .then((data) => {
        if (!data.length) {
          return fetchData<ItemData>(url).then((fetchedData) => {
            addData(table, fetchedData);
            return fetchedData;
          });
        }

        return data;
      })
      .catch((error) => {
        return fetchData<ItemData>(url);
      });

  loadData(Table.Temperature, urls[Table.Temperature])
    .then((data) => (dataSources[Table.Temperature] = data))
    .then(() => setData(Table.Temperature, true));

  loadData(Table.Precipitation, urls[Table.Precipitation]).then((data) => (dataSources[Table.Precipitation] = data));

  /**
   * sets filter properties
   */
  let onMaxChange = (event) => {
    if (event.detail === max) {
      return;
    }

    if (event.detail < min) {
      max = min + 1;
    } else {
      max = event.detail;
    }
    setData(currentType, true);
  };

  let onMinChange = (event) => {
    if (event.detail === min) {
      return;
    }

    if (event.detail > max) {
      min = max - 1;
    } else {
      min = event.detail;
    }
    setData(currentType, true);
  };

  /**
   * create data source for graph
   */
  let setData = async (type: Table = currentType, force = false) => {
    if (type === currentType && !force) {
      return;
    }

    currentType = type;

    // if (!dataSources[type]) {
    //   dataSources[type] = await loadData(type, urls[type]);
    // }

    data = dataSources[type].filter(({ t }) => {
      const year = Number(t.substring(0, 4));
      return year >= min && year <= max;
    });
  };

  // setData(currentType, true);
</script>

<main>
  <section>
    <div class="controls">
      <Button on:click={() => setData(Table.Temperature)}>Temperature</Button>
      <Button on:click={() => setData(Table.Precipitation)}>Precipitation</Button>
    </div>
    <div class="graph-container">
      <div class="filters">
        <Input {max} min={range.min} defaultValue={min} on:change={onMinChange} />
        <Input max={range.max} {min} defaultValue={max} on:change={onMaxChange} />
      </div>

      <div class="graph">
        <Graph {data} />
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
    width: 950px;
    height: 600px;
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
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 4px;
  }

  .filters {
    display: flex;
  }

  .graph {
    flex-grow: 1;
    box-sizing: border-box;
    width: 100%;
    margin-top: 12px;
    border-radius: 4px;
  }
</style>
