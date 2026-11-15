// Portada en túnel: al bajar, la cámara avanza y cada escena llega desde el fondo.
// Sin este archivo o con «reducir movimiento», las escenas quedan una debajo de la otra (tunel.css).
(function () {
  var sec = document.querySelector(".tunel");
  if (!sec) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.documentElement.classList.add("con-tunel");

  var capas = [].slice.call(sec.querySelectorAll(".capa"));
  var N = capas.length;
  var PROF = 1500;          // distancia entre escenas (px de profundidad)
  var FOCO = 1000;          // igual a la perspectiva del CSS
  var lienzo = sec.querySelector(".tunel-lineas");
  var ctx = lienzo.getContext("2d");
  var pista = sec.querySelector(".tunel-pista");
  var indice = sec.querySelector(".tunel-indice");
  var marcas = capas.map(function (c, i) {
    var li = document.createElement("li");
    li.textContent = (i < 9 ? "0" : "") + (i + 1);
    indice.appendChild(li);
    return li;
  });

  // Puntitos de luz repartidos por el túnel.
  var puntos = [];
  for (var k = 0; k < 90; k++) {
    var ang = Math.random() * Math.PI * 2, rad = 0.25 + Math.random() * 1.1;
    puntos.push({ x: Math.cos(ang) * rad, y: Math.sin(ang) * rad, z: Math.random() * 6000 });
  }

  var ancho = 0, alto = 0, dpr = 1;
  function medir() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    ancho = lienzo.clientWidth; alto = lienzo.clientHeight;
    lienzo.width = Math.round(ancho * dpr); lienzo.height = Math.round(alto * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ultimo = -1;
  }

  // Avance de 0 a 1 dentro de la sección, con una pausa en cada escena para que se alcance a leer.
  function objetivo() {
    var r = sec.getBoundingClientRect();
    var recorrido = sec.offsetHeight - window.innerHeight;
    var p = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0;
    var u = p * (N - 1), i = Math.floor(u), f = u - i;
    var g = Math.min(1, Math.max(0, (f - 0.22) / 0.56));
    g = g * g * (3 - 2 * g);
    return Math.min(N - 1, i + g);
  }

  function dibujar(pos) {
    ctx.clearRect(0, 0, ancho, alto);
    var cx = ancho / 2, cy = alto / 2, base = Math.max(ancho, alto) * 0.62;
    var cam = pos * PROF, PASO = 520, off = cam % PASO;
    ctx.lineWidth = 1;
    // Anillos
    for (var k = 0; k < 14; k++) {
      var z = k * PASO - off + 120;
      if (z < 40) continue;
      var r = base * FOCO / (z + 300);
      var a = Math.min(1, (z - 40) / 500) * Math.max(0, 1 - z / 7200) * 0.32;
      ctx.strokeStyle = "rgba(41,176,184," + a.toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    }
    // Líneas que van al fondo
    var rMin = base * FOCO / (7200 + 300), giro = pos * 0.08;
    ctx.strokeStyle = "rgba(41,176,184,0.07)";
    ctx.beginPath();
    for (var j = 0; j < 28; j++) {
      var t = giro + j * Math.PI * 2 / 28, c = Math.cos(t), s = Math.sin(t);
      ctx.moveTo(cx + c * rMin, cy + s * rMin);
      ctx.lineTo(cx + c * base * 2, cy + s * base * 2);
    }
    ctx.stroke();
    // Puntitos
    for (var q = 0; q < puntos.length; q++) {
      var pt = puntos[q];
      var zz = ((pt.z - cam) % 6000 + 6000) % 6000 + 60;
      var e = FOCO / zz;
      var x = cx + pt.x * base * e * 0.9, y = cy + pt.y * base * e * 0.9;
      if (x < -10 || x > ancho + 10 || y < -10 || y > alto + 10) continue;
      var al = Math.min(1, zz / 600) * Math.max(0, 1 - zz / 6000) * 0.8;
      ctx.fillStyle = "rgba(159,221,224," + al.toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(x, y, Math.min(2.6, 0.6 + e * 1.4), 0, Math.PI * 2); ctx.fill();
    }
  }

  var actual = objetivo(), ultimo = -1;
  function pintar(pos) {
    for (var i = 0; i < N; i++) {
      var d = pos - i;                       // 0 = al frente; >0 = ya pasó; <0 = viene
      var op = d > 0 ? 1 - d * 2 : 1 + d * 1.25;   // la que viene aparece recién cerca, para no ensuciar el texto
      op = Math.max(0, Math.min(1, op));
      var c = capas[i];
      if (op <= 0.01) { if (c.style.visibility !== "hidden") c.style.visibility = "hidden"; continue; }
      c.style.visibility = "visible";
      c.style.opacity = op.toFixed(3);
      c.style.transform = "translate3d(0,0," + (d * PROF).toFixed(1) + "px)";
      var activa = Math.abs(d) < 0.3;
      if (c.classList.contains("activa") !== activa) c.classList.toggle("activa", activa);
    }
    var cerca = Math.round(pos);
    marcas.forEach(function (m, i) { m.classList.toggle("activa", i === cerca); });
    if (pista) pista.classList.toggle("fuera", pos > 0.15);
    dibujar(pos);
  }

  var antes = 0;
  function cuadro(t) {
    var dt = antes ? Math.min(100, t - antes) : 16.7; antes = t;
    var meta = objetivo();
    actual += (meta - actual) * (1 - Math.pow(0.88, dt / 16.7));   // igual de suave a cualquier velocidad de pantalla
    if (Math.abs(meta - actual) < 0.0008) actual = meta;
    if (actual !== ultimo) { pintar(actual); ultimo = actual; }
    requestAnimationFrame(cuadro);
  }

  window.addEventListener("resize", medir);
  medir();
  pintar(actual);
  requestAnimationFrame(cuadro);
  // Para las pruebas: escena al frente.
  window.__tunel = function () { return { pos: actual, activa: capas.findIndex(function (c) { return c.classList.contains("activa"); }), n: N }; };
})();
