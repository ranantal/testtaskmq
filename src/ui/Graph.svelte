<script lang="ts">
  import type { ItemData } from 'src/types';
  import { onMount } from 'svelte';
  import dateFormat from 'dateformat';

  export let data: ItemData[];
  $: {
    if (data) {
      render(data);
    }
  }

  let canvasContainer: HTMLElement;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let tooltips: HTMLCanvasElement;
  let tooltipsCtx: CanvasRenderingContext2D;

  // padding for graph
  const PADDING = 25;
  // max and min values from data
  let maxY;
  let minY;
  // size of canvas
  let width;
  let height;
  // steps between values in px
  let stepX;
  let stepY;
  // maps painted graph relative coords to actual canvas coords
  const mapX = (x: number): number => (x * (width - 2 * PADDING)) / width + PADDING;
  const mapY = (y: number): number => height - (y * (height - 2 * PADDING)) / height - PADDING;

  onMount(() => {
    // configuring canvas
    context = canvas.getContext('2d');
    tooltipsCtx = tooltips.getContext('2d');

    width = canvasContainer.getBoundingClientRect().width;
    height = canvasContainer.getBoundingClientRect().height;
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
    const minmax = data.reduce(
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

    maxY = minmax.maxY;
    minY = minmax.minY;

    stepX = width / data.length;
    stepY = height / (maxY - minY);

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
    // two cycles instead of one, because I wanna serif for zero axis to be rendered
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

    // drawing graph
    context.beginPath();
    context.strokeStyle = '#096dd9';

    context.moveTo(mapX(0), mapY((data[0].v - minY) * stepY));
    data.forEach((value, i) => {
      context.lineTo(mapX(i * stepX), mapY((value.v - minY) * stepY));
    });

    context.stroke();
  };

  // create tooltip when mouse moves over the graph
  let onMouseMove = async (event) => {
    const _data = await data;
    if (!_data.length) {
      return;
    }

    const layerX = event.layerX;

    // find value to show
    const valueIndex =
      layerX >= PADDING &&
      _data.findIndex((_, i) => {
        if (mapX(i * stepX) >= layerX && mapX((i + 1) * stepX) > layerX) {
          return true;
        }
      });

    clearTooltips();

    if (typeof valueIndex !== 'number' || !_data[valueIndex]) {
      return;
    }

    const value = _data[valueIndex];
    // draw tooltp
    tooltipsCtx.font = 'normal 12px Arial, sans-serif';
    tooltipsCtx.textAlign = 'left';
    tooltipsCtx.fillStyle = 'black';
    tooltipsCtx.fillText(`${dateFormat(new Date(value.t), 'dd.mm.yyyy')},`, 6, 16);
    tooltipsCtx.fillStyle = 'red';
    tooltipsCtx.fillText(`${value.v}`, 72, 16);

    // make tooltip visiible
    tooltips.style.zIndex = '1';
    tooltips.style.opacity = '1';
    // position tooltip
    tooltips.style.transform = `translate(${mapX(valueIndex * stepX)}px, ${mapY((value.v - minY) * stepY) - PADDING}px)`;
  };

  let clearTooltips = () => {
    tooltips.style.zIndex = '-1';
    tooltips.style.opacity = '0';
    tooltipsCtx.clearRect(0, 0, tooltips.width, tooltips.height);
  };
</script>

{#if !data}
  <div>...waiting</div>
{/if}

<div bind:this={canvasContainer}>
  <canvas bind:this={canvas} on:mousemove={onMouseMove} on:mouseleave={clearTooltips} />
  <canvas class="tooltips" bind:this={tooltips} width={110} height={25} />
</div>

<style>
  div {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .tooltips {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    opacity: 0;

    background-color: white;
    border-radius: 3px;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  }
</style>
