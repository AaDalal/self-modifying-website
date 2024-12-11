<script lang="ts">  
  import { OpenAI } from 'openai';
  import { zodResponseFormat } from "openai/helpers/zod";
  import { z } from 'zod';

  export let apiKey: string;
  export let model: string;
  let innerHtml = '';
  let isEditing = false;
  let editPosition = { x: 0, y: 0 };
  let targetElement: HTMLElement | undefined = undefined;
  let editText = '';
  let tgtElement: HTMLElement; 
  $: boundingBox = targetElement?.getBoundingClientRect();
  $: client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })
  $: console.log(boundingBox)

  const HTMLEdit = z.object({
    reasoning: z.string(),
    html: z.string()
  })

  function handleClick(event: MouseEvent) {
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

  async function handleSubmit(e?: Event) {
    e?.preventDefault();
    e?.stopPropagation();
    if (editText.trim()) {
      const parsedChatCompletion = await client.beta.chat.completions.parse({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are a web editing bot. Please edit the following html ${innerHtml} and output the result in a JSON format with a reasoning key and an html key.` + (targetElement && targetElement !== tgtElement ? 'The user is currently referenceing this element ' + targetElement.outerHTML : '')
          },
          {
            role: 'user',
            content: editText
          }
        ],
        response_format: zodResponseFormat(HTMLEdit, 'HTMLEdit')
      })
      if (parsedChatCompletion.choices[0].message.parsed) {
        const { reasoning, html } = parsedChatCompletion.choices[0].message.parsed;
        innerHtml = html;
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
      class="absolute bg-gray-700 p-4 rounded-lg rounded-tl-none shadow-lg z-20"
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
        >
        </textarea>
        <div>
          <button on:click={handleCancel}>Cancel</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  {/if}
  <div class="w-full h-full" bind:this={tgtElement}>
    {@html innerHtml}
  </div>
</div>
