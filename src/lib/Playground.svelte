<script lang="ts">  
  import { OpenAI } from 'openai';
  import { zodResponseFormat } from "openai/helpers/zod";
  import { z } from 'zod';

  export let apiKey: string;
  export let model: string;
  let innerHtml = '';
  let isEditing = false;
  let editPosition = { x: 0, y: 0 };
  let targetElement: HTMLElement | null = null;
  let editText = '';

  $: console.log(apiKey);

  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

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
      targetElement = event.target as HTMLElement;
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
            content: `You are a web editing bot. Please edit the following html ${innerHtml} and output the result in a JSON format with a reasoning key and an html key.`
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
    <div 
      class="absolute bg-gray-700 p-4 rounded-lg rounded-tl-none shadow-lg"
      style="left: {editPosition.x}px; top: {editPosition.y}px;"
    >
      <form on:submit={handleSubmit}>
        <!-- svelte-ignore a11y_autofocus -->
        <textarea
          autofocus
          bind:value={editText}
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
          }
          }}
        >
        </textarea>
        <div>
          <button on:click={handleCancel}>Cancel</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  {/if}
  <div class="w-100 h-100" id="tgt">
    {@html innerHtml}
  </div>
</div>
