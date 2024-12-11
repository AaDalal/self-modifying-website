<script lang="ts">
  import { OPENAI_MODELS } from './lib/constants';
  import Playground from './lib/Playground.svelte';
  import Setup from './lib/Setup.svelte';

  let apiKey = '';
  let model = OPENAI_MODELS[0];
</script>

<Setup bind:apiKey={apiKey} bind:model={model} class="absolute left-0 top-0 right-0"/>
<Playground class="w-full h-full" apiKey={apiKey} model={model} />