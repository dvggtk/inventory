<script>
  export let image;
  export let equipment;

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function onDelete (e) {
    dispatch("delete", {equipment, image});
  }

</script>

<style>
  .equipment__image-button {
    margin: 0;
    display: block;
    position: absolute;
  }

  .equipment__image-button--delete {
    right: 8px;
    top: 8px;
  }

</style>

<div style="position: relative;">
  <a href={image.url}>
    <img src={image.url} alt="Оргтехника, один экземпляр"/>
  </a>
  <button
    class="equipment__image-button equipment__image-button--delete"
    type="button"
    on:click={onDelete}
  >➖ Удалить
  </button>
</div>

