document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("loginLink");
  const greeting = document.getElementById("userGreeting");
  const greetingName = document.getElementById("userGreetingName");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!loginLink || !greeting || !greetingName || !logoutBtn) {
    return;
  }

  /**
   * Actualiza el navbar según el estado de sesión y rol del usuario.
   */
  function pintarEstadoSesion() {
    const usuario = getUsuarioActivo();
    const esAdmin = esUsuarioAdmin(usuario);

    document.querySelectorAll(".nav-admin-only").forEach((elemento) => {
      elemento.hidden = !esAdmin;
    });

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
    window.location.reload();
  });

  pintarEstadoSesion();
});
