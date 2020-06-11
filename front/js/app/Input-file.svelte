<style>
  .input-file {
    display: block;
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

</script>

<label class="input-file">
  <span class="input-file__button">Добавить фото</span>
  <input
    type="file"
    class="visually-hidden input-file__input"
    {accept}
    on:input
  >
</label>

