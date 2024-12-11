<script lang="ts">
  import { OPENAI_MODELS } from "../lib/constants";
  import DownArrow from "./DownArrow.svelte";

  interface Props {
    apiKey: string;
    model: string;
    class?: string,
  }

  export let apiKey: string;
  export let model: string;
  
  let expanded: boolean = true;
</script>

<div class={$$props.class}>
  {#if expanded}
    <div class="bg-slate-800 flex gap-2 items-center justify-center p-4">
      <label for="apikey">OpenAI key</label>
      <input type="password" id="apikey" bind:value={apiKey}/>
      <label for="model">Model</label>
      <select id="model" value={model}>
        {#each OPENAI_MODELS as model}
          <option value={model}>{model}</option>
        {/each}
      </select>
    </div>
  {/if}
  <div class="rounded-b-full bg-slate-800 w-10 h-8 p-1 px-2 mx-auto" on:click={() => { expanded = !expanded }}>
    <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentcolor" version="1.1" id="Layer_1" viewBox="0 0 512 512" xml:space="preserve" class={`w-full h-full transform ${expanded ? '' : 'rotate-180'}`}>
      <g>
        <g>
          <g>
            <path d="M347.582,198.248L256,289.83l-91.582-91.582c-8.331-8.331-21.839-8.331-30.17,0c-8.331,8.331-8.331,21.839,0,30.17     l106.667,106.667c8.331,8.331,21.839,8.331,30.17,0l106.667-106.667c8.331-8.331,8.331-21.839,0-30.17     C369.42,189.917,355.913,189.917,347.582,198.248z"/>
          </g>
        </g>
      </g>
    </svg>
  </div>
</div>

<style>
  .rotate-180 {
    transform: rotate(180deg);
  }
</style>