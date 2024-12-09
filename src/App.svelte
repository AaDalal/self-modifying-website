<script lang="ts">
  let isEditing = false;
  let editPosition = { x: 0, y: 0 };
  let editText = '';
  let contents: Array<{x: number, y: number, text: string}> = [];

  function handleClick(event: MouseEvent) {
    if (!isEditing) {
      isEditing = true;
      editPosition = {
        x: event.clientX,
        y: event.clientY
      };
      editText = '';
    }
  }

  function handleSubmit() {
    if (editText.trim()) {
      contents = [...contents, {
        x: editPosition.x,
        y: editPosition.y,
        text: editText
      }];
    }
    isEditing = false;
    editText = '';
  }
</script>

<main on:click={handleClick}>
  {#each contents as content}
    <div 
      class="content-item"
      style="left: {content.x}px; top: {content.y}px;"
    >
      {content.text}
    </div>
  {/each}

  {#if isEditing}
    <div 
      class="edit-input"
      style="left: {editPosition.x}px; top: {editPosition.y}px;"
    >
      <input
        type="text"
        bind:value={editText}
        on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
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
