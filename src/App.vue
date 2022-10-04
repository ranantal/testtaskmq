<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { getData } from './utils';
    import type { ItemData } from './types';

    /** data */
    let temperature = ref<ItemData[]>([]);
    let precipitation = ref<ItemData[]>([]);

    onMounted(async () => {
        temperature.value = await getData<ItemData>('../data/temperature.json');
        precipitation.value = await getData<ItemData>('../data/precipitation.json');
    });
</script>

<template>
    <div>
        <div>
            Temperature data length: {{temperature.length}}
            <details>
                <summary>Temperature</summary>
                {{temperature}}
            </details>
        </div>
        <br>
        <div>
            Precipitation data length: {{precipitation.length}}
            <details>
                <summary>Precipitation</summary>
                {{precipitation}}
            </details>
        </div>
    </div>
</template>

<style scoped>
</style>
