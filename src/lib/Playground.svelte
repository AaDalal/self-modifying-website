<script lang="ts">  
  import { OpenAI } from 'openai';
  import { zodResponseFormat } from "openai/helpers/zod";
  import { z } from 'zod';
  import htmlStore from './htmlStore';

  export let apiKey: string;
  export let model: string;
  export let editMode: boolean;

  
  let isEditing = false;
  let generating = false;
  let error = false;
  let editPosition = { x: 0, y: 0 };
  let targetElement: HTMLElement | undefined = undefined;
  let editText = '';
  let tgtElement: HTMLElement; 
  $: boundingBox = targetElement?.getBoundingClientRect();
  $: client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  $: console.log($htmlStore)

  const HTMLEdit = z.object({
    reasoning: z.string(),
    html: z.string()
  })

  function handleClick(event: MouseEvent) {
    if (!editMode) return;
    if (!isEditing) {
      isEditing = true;
      editPosition = {
        x: event.clientX,
        y: event.clientY
      };
      if (tgtElement.contains(event.target as HTMLElement)) targetElement = event.target as HTMLElement
      else targetElement = tgtElement;
      editText = '';
    }
  }

  function postProcessHtml(html: string) {
    const playgroundContent = new DOMParser().parseFromString(html, 'text/html');
    playgroundContent.querySelectorAll('style').forEach(style => {
      if (style.textContent) {
        // this very naively switches HTML and body tags to the target element
        style.textContent = style.textContent.replace(/(?<=^|\W|})html|body(?=\W|{)/g, '#tgt-inner');
        // wrap the css in a scoped selector so it doesn't affect the rest of the page
        style.textContent = `@scope (#tgt) {\n${style.textContent}\n}`;
      }
    });
    return playgroundContent.documentElement.innerHTML;
  }

  $: innerHtml = postProcessHtml($htmlStore);

  async function handleSubmit(e?: Event) {
    e?.preventDefault();
    e?.stopPropagation();
    error = false;
    if (editText.trim()) {
      generating = true;
      let parsedChatCompletion;
      try {
        parsedChatCompletion = await client.beta.chat.completions.parse({
          model: model,
          messages: [
            {
              role: 'system',
              content: `You are a web editing bot that goes above and beyond to imagine your client's dreams! Please edit the following html ${$htmlStore} and output the result in a JSON format with a reasoning key and an html key.` + (targetElement && targetElement !== tgtElement ? 'The user is currently referenceing this element ' + targetElement.outerHTML : '')
            },
            {
              role: 'user',
              content: editText
            }
          ],
          response_format: zodResponseFormat(HTMLEdit, 'HTMLEdit')
        })
      } catch (e) {
        console.error(e);
        error = true;
        return
      } finally {
        generating = false;
      }
      if (parsedChatCompletion.choices[0].message.parsed) {
        const { reasoning, html } = parsedChatCompletion.choices[0].message.parsed;
        htmlStore.set(html);
      } else {
        // TODO
      }
    }
    isEditing = false;
    editText = '';
  }

  function handleCancel(e?: Event) {
    e?.preventDefault();
    e?.stopPropagation();
    isEditing = false;
    editText = '';
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div on:click={handleClick} class={$$props.class}>
  {#if isEditing}
    {#if boundingBox !== undefined}
    <div 
      class="absolute bg-opacity-15 bg-orange-400 z-10"
      id="overlay"
      style="left: {boundingBox.left}px; top: {boundingBox.top}px; width: {boundingBox.width}px; height: {boundingBox.height}px;"
    >
    </div>
    {/if}
    <div 
      class="w-3 h-3 absolute bg-red-600 z-30"
      style="left: {editPosition.x}px; top: {editPosition.y}px;"
    >
    </div>
    <div 
      class="absolute dark:bg-slate-800 bg-slate-300 p-4 shadow-lg z-20"
      style="left: {editPosition.x}px; top: {editPosition.y}px;"
    >
      <form 
      on:submit={handleSubmit}
      on:keydown={(e) => {
        switch (e.key) {
          case 'Escape':
            handleCancel();
            break
          case 'Enter':
            handleSubmit()
            break
          default:
            break;
          case 'ArrowUp': {
            // Can't go up if we're at the top
            if (targetElement?.parentElement && tgtElement !== targetElement?.parentElement) {
              targetElement = targetElement?.parentElement;
            }
            break;
          }
          case 'ArrowDown': {
            if (targetElement && targetElement?.children.length > 0) {
              targetElement = targetElement?.children[0] as HTMLElement;
            }
            break;
          }
          case 'ArrowLeft': {
            if (targetElement && targetElement?.previousElementSibling) {
              targetElement = targetElement?.previousElementSibling as HTMLElement;
            }
            break;
          }
          case 'ArrowRight': {
            if (targetElement && targetElement?.nextElementSibling) {
              targetElement = targetElement?.nextElementSibling as HTMLElement;
            }
            break;
          }
        }
      }}
      >
        <!-- svelte-ignore a11y_autofocus -->
        <textarea
          autofocus
          bind:value={editText}
          placeholder="Type the edit you want here"
        >
        </textarea>
        <div>
          <button class="rounded-none" on:click={handleCancel}>Cancel</button>
          <button class="rounded-none" type="submit">Submit</button>
          {#if !apiKey}
            <div class="inline-flex text-red-800 text-sm items-center g-2">
              <div class="inline-block w-4 h-4 bg-red-800 mr-1"></div>
              <span>You need to enter an API key</span>
            </div>
          {:else if generating}
            <div class="inline-flex text-green-800 text-sm items-center g-2">
              <div class="inline-block w-4 h-4 bg-green-800 mr-1 animate-bounce"></div>
              <span>Generating...</span>
            </div>
          {/if}
        </div>
        <div class="italic text-sm text-wrap max-w-full">Tip: use the <kbd>up</kbd> <kbd>down</kbd> <kbd>left</kbd ><kbd>right</kbd> keys to change your selection</div>
      </form>
    </div>
  {/if}
  <div class="w-full h-full -z-10" bind:this={tgtElement} id="tgt">
    <div id="tgt-inner">
      {@html innerHtml}
    </div>
  </div>
</div>
