export async function getEquipments() {
  const res = await fetch(`/api/equipments`);
  const equipments = await res.json();

  return equipments;
}

export async function deleteImage(equipment, image) {
  const filename = image.url.match(/\/([^\/]+)$/)[1];

  const res = await fetch(
    `/api/equipments/${equipment._id}/images/${filename}`,
    {method: "DELETE"}
  );

  const json = await res.json();
}

export async function submitImage(equipment, file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`/api/equipments/${equipment._id}/images`, {
    method: "POST",
    body: formData
  });
  const json = await res.json();

  return json;
}
