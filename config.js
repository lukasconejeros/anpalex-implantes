// Datos que se cambian sin tocar la página.
// Lo que está vacío todavía no existe: la página funciona igual y lo salta.
window.ANPALEX = {
  // WhatsApp de la clínica (lo atiende el bot). Solo números, con el 56.
  whatsapp: "56978565936",

  // Mensaje que el paciente manda desde la página de gracias. {nombre} se reemplaza.
  mensajeWhatsapp: "Hola, vengo de la página de implantes y quiero reservar mi evaluación sin costo. Mi nombre es {nombre}.",

  // Píxel de Meta de Anpalex («Pixel Anpalex_Up», cuenta Clínica Anpalex). Lead se marca en gracias.html.
  pixelId: "276186522022414",

  // Servidor del bot de Anpalex: revisa que el número tenga WhatsApp y el bot le escribe primero (12-11-2026).
  guardarDatosEn: "https://clinica-anpalex-clinica-anpalex.bvil2a.easypanel.host/api/pagina-implantes",

  // Video horizontal de la página (guion P). Link de YouTube "embed" o archivo .mp4.
  video: "video/dr-herrera-implantes.mp4",
  // Foto que se ve antes de apretar play (un cuadro del mismo video).
  videoPortada: "video/dr-herrera-portada.jpg",
};
