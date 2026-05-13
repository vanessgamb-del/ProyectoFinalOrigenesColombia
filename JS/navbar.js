document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("loginLink");
  const greeting = document.getElementById("userGreeting");
  const greetingName = document.getElementById("userGreetingName");
  const logoutBtn = document.getElementById("logoutBtn");

  // Si la página no expone los placeholders del navbar dinámico,
  // salimos en silencio en vez de lanzar errores.
  if (!loginLink || !greeting || !greetingName || !logoutBtn) {
    return;
  }

  function pintarEstadoSesion() {
    const usuario = getUsuarioActivo();

    if (usuario && usuario.nombre) {
      greetingName.textContent = capitalizarNombre(usuario.nombre);
      loginLink.hidden = true;
      greeting.hidden = false;
      logoutBtn.hidden = false;
    } else {
      loginLink.hidden = false;
      greeting.hidden = true;
      logoutBtn.hidden = true;
    }
  }

  logoutBtn.addEventListener("click", () => {
    cerrarSesion();
    // Recargamos para que cualquier estado dependiente de sesión
    // (futuras vistas protegidas, saludos, etc.) se reinicie.
    window.location.reload();
  });

  pintarEstadoSesion();
});
