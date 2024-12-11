<script lang="ts">
  import { OPENAI_MODELS } from './lib/constants';
  import Playground from './lib/Playground.svelte';
  import Setup from './lib/Setup.svelte';

  let apiKey = '';
  let model = OPENAI_MODELS[0];
  let editMode = true;
</script>

<Setup bind:apiKey={apiKey} bind:model={model} bind:editMode={editMode} class="absolute left-0 top-0 right-0 z-20"/>
<Playground class="w-full h-full" apiKey={apiKey} model={model} editMode={editMode} />