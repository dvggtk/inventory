<script>
  import InputFile from "./Input-file.svelte";
  import Image from "./Image.svelte";
  import {onMount} from "svelte";

  import {getEquipments, deleteImage, submitImage} from "./api/equipments";

  let equipments = [];

  async function onDeleteImage (e) {
    const {equipment, image} = e.detail;

    if (!confirm("Удалить фото?")) return false;

    await deleteImage(equipment, image);

    const idx = equipment.images.findIndex((img) => img === image);
    equipment.images.splice(idx, 1);
    equipments = equipments;
  };

  async function onAddImage(e) {
    const {equipment, files} = e.detail;
    const file = files[0];

    const url = await submitImage(equipment, file);

    equipment.images.push({url});
    equipments = equipments;
  }

  onMount(async ()=>{
    equipments = await getEquipments();
  })
</script>

<style>
</style>

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
          {#each equipment.images as image, imgNo (image.url)}
            <li class="equipment__image">
              <Image {equipment} {image} on:delete={onDeleteImage}/>
            </li>
          {/each}
        </ul>
        <InputFile accept="image/*" on:input={onAddImage} equipment={equipment}/>
      </li>
    {/each}
  {/if}
</ul>

