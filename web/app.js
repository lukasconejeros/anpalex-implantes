// Web Anpalex v5: menú, animaciones de entrada, links de WhatsApp, formulario, antes/después y aviso de promoción.
(function () {
  var C = window.ANPALEX || {};
  var wsp = function (texto) { return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(texto || C.mensaje); };

  // Links de WhatsApp: <a data-wsp="texto opcional">
  document.querySelectorAll("[data-wsp]").forEach(function (a) {
    a.href = wsp(a.getAttribute("data-wsp") || C.mensaje);
    a.target = "_blank"; a.rel = "noopener";
  });
  document.querySelectorAll("[data-agenda]").forEach(function (a) { a.href = C.agendaOnline; a.target = "_blank"; a.rel = "noopener"; });

  // Cabecera con sombra al bajar y menú de teléfono
  var cab = document.querySelector(".cabecera");
  var sombra = function () { cab.classList.toggle("con-sombra", window.scrollY > 10); };
  window.addEventListener("scroll", sombra, { passive: true }); sombra();
  var boton = document.querySelector(".abrir-menu");
  if (boton) boton.addEventListener("click", function () {
    var abierto = cab.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
  document.querySelectorAll(".menu a").forEach(function (a) {
    a.addEventListener("click", function () { cab.classList.remove("abierto"); if (boton) boton.setAttribute("aria-expanded", "false"); });
  });

  // Animación de entrada
  var entran = document.querySelectorAll(".entra");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visto"); obs.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    entran.forEach(function (el) { obs.observe(el); });
  } else entran.forEach(function (el) { el.classList.add("visto"); });

  // Antes y después
  document.querySelectorAll(".antes-despues").forEach(function (c) {
    var r = c.querySelector("input"), a = c.querySelector(".ad-antes"), l = c.querySelector(".ad-linea");
    var mover = function () { a.style.clipPath = "inset(0 " + (100 - r.value) + "% 0 0)"; if (l) l.style.left = r.value + "%"; };
    r.addEventListener("input", mover); mover();
  });

  // Formulario: sin servidor, arma el mensaje y abre WhatsApp
  var f = document.querySelector("#form-contacto");
  if (f) f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var d = new FormData(f), partes = ["Hola, vengo de la página web."];
    if (d.get("nombre")) partes.push("Mi nombre es " + d.get("nombre") + ".");
    if (d.get("tratamiento")) partes.push("Me interesa: " + d.get("tratamiento") + ".");
    if (d.get("consulta")) partes.push(d.get("consulta"));
    if (d.get("telefono")) partes.push("Mi teléfono: " + d.get("telefono"));
    window.open(wsp(partes.join(" ")), "_blank", "noopener");
  });

  // Aviso de la promoción (solo en Inicio, una vez por visita, a los 8 s)
  var aviso = document.querySelector(".aviso");
  if (aviso) {
    var cerrar = function () { aviso.classList.remove("abierto"); try { sessionStorage.setItem("anpalex-aviso", "1"); } catch (e) {} };
    aviso.addEventListener("click", function (e) { if (e.target === aviso || e.target.closest(".cerrar")) cerrar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrar(); });
    var visto = false; try { visto = sessionStorage.getItem("anpalex-aviso") === "1"; } catch (e) {}
    if (!visto && !/[?&]sinaviso/.test(location.search)) setTimeout(function () { aviso.classList.add("abierto"); }, 8000);
  }
})();
