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

  function onAddImage(e) {
    const {equipment, files} = e.detail;

    const file = files[0];
    const image = {url: "loading" + Math.random()};
    equipment.images.push(image);

    (async () => {
      try {
        const img = await submitImage(equipment, file);
        for (const [key, value] of Object.entries(img)) {
          image[key] = value;
        }
      } catch (err) {
          console.error(err);
          equipment.images = equipment.images.filter((img) => img !== image);
      } finally {
        equipments = equipments;
      }
    })();

    equipments = equipments;
  }

  onMount(async ()=>{
    equipments = await getEquipments();
  })
</script>

<style>
  .image-placeholder {
    padding: 30px 0;
    display: flex;
    justify-content: center;
    align-content: center;
  }
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
              {#if !image.url.startsWith("loading")}
                <Image {equipment} {image} on:delete={onDeleteImage}/>
              {:else}
                <div class="image-placeholder">⏳ Загружается фото</div>
              {/if}
            </li>
          {/each}
        </ul>
        <InputFile accept="image/*" on:input={onAddImage} equipment={equipment} isLoading={equipment._isLoadingImage}/>
      </li>
    {/each}
  {/if}
</ul>

