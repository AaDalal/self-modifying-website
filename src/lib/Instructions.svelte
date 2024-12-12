<script lang="ts">
    let expanded: boolean = true;
</script>

{#if expanded}
    <div class="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center z-30">
        <div class="shadow bg-slate-400 dark:bg-slate-800 flex flex-col max-w-2xl bg-opacity-10 backdrop-blur-sm">
            <div class="w-full flex justify-end p-4 bg-slate-500 dark:bg-slate-700">
                <button class="border-2 dark:border-white dark:text-white bg-transparent p-1 px-2 rounded-none" on:click={() => { expanded = false }}>
                    X
                </button>
            </div>
            <div class="p-8">
                <h1 class="pt-0 mt-4">Instructions</h1>
                <ol>
                    <li>Enter your API Key at the top</li>
                    <li>Select a model</li>
                    <li>Click the "Edit Mode" checkbox to enable editing (it's checked by default)</li>
                    <li>Type in an edit you want to see. Click submit and wait for the model to generate a response.</li>
                    <li>The screen will uodate</li>
                </ol>
                <h2>Advanced</h2>
                <ul>
                    <li>You can click the <kbd>up</kbd> and <kbd>down</kbd> arrow keys to switch to editing the parent/child of the currently selected element. You can click <kbd>left</kbd> and <kbd>right</kbd> to go to the siblings</li>
                </ul>
            </div>
        </div>
    </div>
{/if}