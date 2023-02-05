<script lang="ts">
  import type { ItemData } from 'src/types';
  import { onMount } from 'svelte';
  import dateFormat from 'dateformat';

  export let data: Promise<ItemData[]>;
  $: {
    data.then((values) => render(values));
  }

  let canvasContainer: HTMLElement;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  onMount(() => {
    // configuring canvas
    context = canvas.getContext('2d');

    const { width, height } = canvasContainer.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
  });

  const render = (data: ItemData[]) => {
    if (data.length === 0 || !canvas) {
      return;
    }

    // clear canvas
    const { width, height } = canvas;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // max and min values from data
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

    // steps between values in px
    const stepX = width / data.length;
    const stepY = height / (maxY - minY);

    // maps painted graph relative coords to actual canvas coords
    const mapX = (x: number): number => (x * (width - 50)) / width + 25;
    const mapY = (y: number): number => height - (y * (height - 50)) / height - 25;

    // drawing axis
    context.beginPath();
    context.strokeStyle = '#000';

    context.moveTo(mapX(0), mapY(0));
    context.lineTo(mapX(0), mapY(height));
    context.moveTo(mapX(0), mapY((0 - minY) * stepY));
    context.lineTo(mapX(width), mapY((0 - minY) * stepY));

    context.stroke();

    // drawing serifs for y axis
    const roundedMinY = Math.ceil(minY);
    const roundedMaxY = Math.floor(maxY);
    const ySerifStep = Math.floor((roundedMaxY - roundedMinY) / 10);

    const renderSerif = (i) => {
      context.fillText(`${i}`, mapX(-7), mapY((i - minY) * stepY - 4));
      if (i !== 0) {
        context.moveTo(mapX(0), mapY((i - minY) * stepY));
        context.lineTo(mapX(width), mapY((i - minY) * stepY));
      }
    };

    context.font = 'norrmal 12px Arial, sans-serif';
    context.textAlign = 'right';
    context.strokeStyle = '#DDD';
    context.beginPath();
    for (let i = 0; i < maxY; i += ySerifStep) {
      renderSerif(i);
    }
    for (let i = -ySerifStep; i > minY; i -= ySerifStep) {
      renderSerif(i);
    }
    context.stroke();

    // drawing serifs for x axis
    const xSerifStep = Math.floor(data.length / 11);

    context.textAlign = 'center';
    for (let i = 0; i < data.length; i += xSerifStep) {
      context.fillText(dateFormat(data[i].t, 'mmm yyyy'), mapX(i * stepX), mapY(-20));
    }

    //drawing graph
    context.beginPath();
    context.strokeStyle = '#096dd9';

    context.moveTo(mapX(0), mapY((data[0].v - minY) * stepY));
    data.forEach((value, i) => {
      context.lineTo(mapX(i * stepX), mapY((value.v - minY) * stepY));
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
