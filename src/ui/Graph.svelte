<script>
  export let data = [];
</script>

<div>
  {#if data}
    <!-- {#each data as el}
      {el.v}
    {/each} -->
    {data[0].v}
  {/if}
</div>

<style></style>
