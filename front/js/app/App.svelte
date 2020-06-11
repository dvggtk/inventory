<script>
  import InputFile from "./Input-file.svelte";
	import { onMount } from 'svelte';
  let equipments;

  function onSelectImage(e) {
    console.log(e);
  }

  onMount(async ()=>{
    const res = await fetch(`/api/equipments`);
    equipments = await res.json();
  })
</script>

<style>

</style>

<InputFile accept="image/*" on:input={onSelectImage}/>

<hr>


<ul class="equipments-list">
  {#if equipments}
    {#each equipments as equipment, idx (equipment._id)}
      <li class="equipments-list__item equipment">
        <div class="equipment__inventory-number">{equipment.inventoryNumber}</div>
        <div class="equipment__model">{equipment.model}</div>
        <div class="equipment__office">{equipment.office}</div>
        <div class="equipment__resp-person">{equipment.respPerson}</div>
        <div class="equipment__id">{equipment._id}</div>
        <ul class="equipment__images-list">
          {#each equipment.images as image, imgNo (image.filename)}
            <li class="equipment__image">
              <a href={"equipments/img/" + image.filename}>
                <img src={"equipments/img/" + image.filename} alt="Оргтехника, один экземпляр"/>
              </a>
            </li>
          {/each}
        </ul>
        <InputFile accept="image/*"/>
      </li>
    {/each}
  {/if}
</ul>

