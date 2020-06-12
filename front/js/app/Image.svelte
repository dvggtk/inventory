<script>
  export let image;
  export let equipment;

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function onSubmit (e) {
    dispatch("submit", {equipment, image});
  }
  function onCancel (e) {
    dispatch("cancel", {equipment, image});
  }
  function onDelete (e) {
    dispatch("delete", {equipment, image});
  }

</script>

<style>
  .equipment__image-button {
    display: block;
    position: absolute;
  }

  .equipment__image-button--delete {
    right: 8px;
    top: 8px;
  }

  .equipment__image-button--cancel {
    right: 8px;
    top: 8px;
  }

  .equipment__image-button--submit {
    right: 8px;
    bottom: 8px;
  }
</style>

<div style="position: relative;">
  <a href={image.url}>
    <img src={image.url} alt="Оргтехника, один экземпляр"/>
  </a>
  {#if image.url.startsWith("blob:")}
    <button
      class="equipment__image-button equipment__image-button--submit"
      type="button"
      on:click={onSubmit}
    >✔️
    </button>
    <button
      class="equipment__image-button equipment__image-button--cancel"
      type="button"
      on:click={onCancel}
    >❌
    </button>
  {:else}
    <button
      class="equipment__image-button equipment__image-button--delete"
      type="button"
      on:click={onDelete}
    >➖
    </button>
  {/if}
</div>

