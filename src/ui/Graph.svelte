<script lang="ts">
  import type { ItemData } from 'src/types';
  import { onMount } from 'svelte';

  export let data: Promise<ItemData[]>;
  $: {
    data.then((values) => render(values));
  }

  let canvasContainer: HTMLElement;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  onMount(() => {
    context = canvas.getContext('2d');

    const { width, height } = canvasContainer.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
  });

  const render = (data: ItemData[]) => {
    if (data.length === 0 || !canvas) {
      return;
    }

    const { width, height } = canvas;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const { maxY, minY } = data.reduce(
      (acc, val) => {
        if (val.v < acc.minY) {
          acc.minY = val.v;
        }
        if (val.v > acc.maxY) {
          acc.maxY = val.v;
        }
        return acc;
      },
      { minY: Infinity, maxY: -Infinity }
    );

    const minX = data[0].t;
    const maxX = data[data.length - 1].t;

    const stepX = width / data.length;
    const stepY = height / (maxY - minY);

    context.beginPath();
    context.strokeStyle = '#BBB';

    context.moveTo(0, height);
    context.lineTo(0, 0);
    context.moveTo(0, height - (0 - minY) * stepY);
    context.lineTo(width, height - (0 - minY) * stepY);

    context.stroke();

    context.beginPath();
    context.strokeStyle = '#444';

    context.moveTo(0, height - (data[0].v - minY) * stepY);
    data.forEach((value, i) => {
      context.lineTo(i * stepX, height - (value.v - minY) * stepY);
    });

    context.stroke();
  };
</script>

<div bind:this={canvasContainer}>
  <canvas bind:this={canvas} />
</div>

<style>
  div {
    height: 100%;
    width: 100%;
  }
</style>
