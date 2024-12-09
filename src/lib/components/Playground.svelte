<script lang="ts">
  let isEditing = false;
  let editPosition = { x: 0, y: 0 };
  let targetElement: HTMLElement | null = null;
  let editText = '';

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

  function handleSubmit() {
    if (editText.trim()) {

    }
    isEditing = false;
    editText = '';
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main on:click={handleClick}>
  {#if isEditing}
    <div 
      class="edit-input"
      style="left: {editPosition.x}px; top: {editPosition.y}px;"
    >
      <input
        type="text"
        bind:value={editText}
        on:keydown={(e) => {
          switch (e.key) {
            case 'Escape':
              isEditing = false
              break
            case 'Enter':
              handleSubmit()
              break
            default:
              break;
          }
        }}
        autofocus
      />
    </div>
  {/if}
</main>

<style>
  main {
    width: 100%;
    height: 100vh;
    position: relative;
  }

  .content-item {
    position: absolute;
    transform: translate(-50%, -50%);
    padding: 4px;
  }

  .edit-input {
    position: absolute;
    transform: translate(-50%, -50%);
  }

  input {
    padding: 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
