<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function onClick() {
    dispatch('click');
  }
</script>

<button on:click={onClick}>
  <slot />
</button>

<style>
  button {
    display: flex;
    justify-content: center;
    align-items: center;

    box-sizing: border-box;
    height: 32px;
    width: max-content;
    padding: 0 16px;
    border: 1px solid var(--color-primary-7);
    border-radius: 4px;

    color: white;
    background-color: var(--color-primary-7);

    font-size: 14px;

    cursor: pointer;

    transition: all 200ms ease-out;
  }

  button:hover {
    border: 1px solid var(--color-primary-5);
    background-color: var(--color-primary-5);
  }

  button:active {
    opacity: 0.8;
  }
</style>
