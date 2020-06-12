<script>
  import InputFile from "./Input-file.svelte";
  import Image from "./Image.svelte";
  import {onMount} from "svelte";

  import {getEquipments, deleteImage, submitImage} from "./api/equipments";

  let equipments = [];

  async function onSubmitImage (e) {
    const {equipment, image} = e.detail;

    const url = await submitImage(equipment, image);
    image.url = url;
    delete image.original;
    equipments = equipments;
  };

  function onCancelImage (e) {
    const {equipment, image} = e.detail;
    URL.revokeObjectURL(image.url);
    equipment.images = equipment.images.filter((img) => img !== image);
    equipments = equipments;
  };

  async function onDeleteImage (e) {
    const {equipment, image} = e.detail;

    if (!confirm("Удалить фото?")) return false;

    await deleteImage(equipment, image);

    const idx = equipment.images.findIndex((img) => img === image);
    equipment.images.splice(idx, 1);
    equipments = equipments;
  };

  function onAddImage(e) {
    const equipment = e.detail.equipment;
    const file = e.detail.files[0];
    const url = URL.createObjectURL(file);

    equipment.images.push({url, original: file});
    equipments = equipments;
  }

  onMount(async ()=>{
    equipments = await getEquipments();
  })
</script>

<style>
</style>

<hr>

<InputFile accept="image/*" on:input={onAddImage} equipment={null}/>

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
              <Image {equipment} {image} on:submit={onSubmitImage} on:cancel={onCancelImage} on:delete={onDeleteImage}/>
            </li>
          {/each}
        </ul>
        <InputFile accept="image/*" on:input={onAddImage} equipment={equipment}/>
      </li>
    {/each}
  {/if}
</ul>

