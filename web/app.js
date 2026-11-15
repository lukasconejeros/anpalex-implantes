(function () {
  var C = window.ANPALEX || {};
  document.documentElement.classList.add("js");

  // Botones de WhatsApp: abren el chat con el mensaje ya escrito (y el tratamiento si lo trae).
  function linkWhatsapp(tema) {
    var texto = tema
      ? "Hola, vengo de la página web y quiero información sobre " + tema + "."
      : C.mensaje;
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(texto);
  }
  document.querySelectorAll(".js-wa").forEach(function (a) {
    a.href = linkWhatsapp(a.getAttribute("data-tema"));
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll(".js-agenda").forEach(function (a) { a.href = C.agendaOnline; });
  document.querySelectorAll(".js-implantes").forEach(function (a) { a.href = C.paginaImplantes; });

  // Sombra de la cabecera al bajar.
  var cab = document.getElementById("cabecera");
  function sombra() { cab.classList.toggle("con-sombra", window.scrollY > 10); }
  window.addEventListener("scroll", sombra, { passive: true });
  sombra();

  // Menú del teléfono.
  var botonMenu = document.querySelector(".boton-menu");
  if (botonMenu) {
    botonMenu.addEventListener("click", function () {
      var abierto = document.documentElement.classList.toggle("menu-abierto");
      botonMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
    document.querySelectorAll(".menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.documentElement.classList.remove("menu-abierto");
        botonMenu.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Aparecer al bajar.
  var piezas = document.querySelectorAll(".aparece");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    piezas.forEach(function (p) { obs.observe(p); });
  } else {
    piezas.forEach(function (p) { p.classList.add("visible"); });
  }

  // Antes y después deslizables.
  document.querySelectorAll(".antes-despues").forEach(function (caja) {
    var rango = caja.querySelector("input");
    function mover() { caja.style.setProperty("--corte", rango.value + "%"); }
    rango.addEventListener("input", mover);
    mover();
  });

  // Video del Dr. Herrera: arranca con sonido al tocar el botón.
  var video = document.getElementById("video-herrera");
  var play = document.querySelector(".boton-play");
  if (video && play) {
    play.addEventListener("click", function () {
      play.hidden = true;
      video.muted = false;
      video.play();
    });
    video.addEventListener("play", function () { play.hidden = true; });
  }
})();
