// Datos que se cambian sin tocar la página.
// Lo que está vacío todavía no existe: la página funciona igual y lo salta.
window.ANPALEX = {
  // WhatsApp de la clínica (lo atiende el bot). Solo números, con el 56.
  whatsapp: "56978565936",

  // Mensaje que el paciente manda desde la página de gracias. {nombre} se reemplaza.
  mensajeWhatsapp: "Hola, vengo de la página de implantes y quiero reservar mi evaluación sin costo. Mi nombre es {nombre}.",

  // Píxel de Meta de implantes (pendiente #530: falta el acceso a la cuenta de anuncios).
  pixelId: "",

  // Dónde se guardan los datos del formulario para que la secretaria llame a los que no escriben.
  // Vacío = todavía no se guardan en ninguna parte (pendiente).
  guardarDatosEn: "",

  // Video horizontal de la página (guion P). Link de YouTube "embed" o archivo .mp4.
  video: "",
};
