<style>
  .input-file {
    display: inline-block;
    margin: 0;
    border: 1px solid #ccc;
    padding: 4px;
    background-color: silver;
}
  .input-file:active {
    transform: translate(0, 4px);
  }
</style>

<script>
  export let accept;
  export let equipment;

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function input(e) {
    if (e.target.files.length === 0) return;

    const files = e.target.files;
    dispatch('input', {equipment, files});
  }
</script>

<label class="input-file">
  <span class="input-file__button">➕ Добавить фото</span>
  <input
    type="file"
    class="visually-hidden input-file__input"
    {accept}
    on:input={input}
  >
</label>

