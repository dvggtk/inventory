<script>
	import { onMount } from 'svelte';
  let name = 'Svelte';

  onMount(async ()=>{
    const res = await fetch(`/api/equipments`);
    const equipments = await res.json();
    console.log(equipments);
  })
</script>

<style>
  h1 {
    background-color: beige;
  }
</style>

<h1>{name} works!</h1>
