<script>
  import { createEventDispatcher } from 'svelte';
  import { clickOutside } from './click-outside.js';
  import Button from './Button.svelte';

  export let max = 9999;
  export let min = 0;
  export let defaultValue = 0;
  const dispatch = createEventDispatcher();

  let innerValue = defaultValue;
  let showOptions = false;

  let changeValue = (value) => {
    innerValue = value;
    dispatch('change', innerValue);
  };

  let onChange = (event) => {
    let value = event.target.value;

    if (value < min) {
      value = min;
    }

    if (value > max) {
      value = max;
    }

    changeValue(value);
  };

  let onClick = () => {
    showOptions = true;
  };

  let onSelectOption = (value) => {
    changeValue(value);
    showOptions = false;
  };

  let onClickOutside = () => {
    showOptions = false;
  };
</script>

<div class="container">
  <input on:change={onChange} value={innerValue} />
  <Button on:click={onClick}>
    <svg viewBox="64 64 896 896" focusable="false" data-icon="down" width="1em" height="1em" fill="white" aria-hidden="true"
      ><path
        d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
      /></svg
    >
  </Button>

  {#if showOptions}
    <div class="options" use:clickOutside on:click_outside={onClickOutside}>
      {#each Array(max - min + 1) as _, i}
        <div on:click={() => onSelectOption(i + min)} class="option" class:selected={i + min === innerValue}>{i + min}</div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    position: relative;
    display: flex;
    width: max-content;
  }

  input {
    box-sizing: border-box;
    height: 32px;
    padding-left: 16px;
    border: 1px solid var(--color-primary-7);
    border-radius: 4px 0 0 4px;

    font-size: 14px;
  }

  .options {
    position: absolute;
    overflow: scroll;

    top: 32px;
    left: 0;

    box-sizing: border-box;
    width: 100%;
    height: 300px;
    padding: 4px;

    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  .option {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 14px;
    transition: all 400ms ease-out;
    cursor: pointer;
  }

  .option:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }

  .selected {
    color: var(--color-primary-7);
  }
</style>
