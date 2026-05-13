const loginForm = document.getElementById("loginForm");
const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");

const loginEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REDIRECT_DELAY_MS = 800;

function mostrarMensajeLogin(texto, tipo) {
  if (!loginMessage) return;
  loginMessage.textContent = texto;
  loginMessage.classList.remove("is-error", "is-success");
  loginMessage.classList.add(tipo === "ok" ? "is-success" : "is-error");
}

function manejarLogin(event) {
  event.preventDefault();

  // Normalizamos a minúsculas porque registro.js guarda el correo así;
  // comparar en minúsculas evita falsos negativos por mayúsculas.
  const correo = loginEmailInput.value.trim().toLowerCase();
  const contrasena = loginPasswordInput.value;

  if (!loginEmailRegex.test(correo)) {
    mostrarMensajeLogin("Ingresa un correo válido.", "err");
    return;
  }

  const usuarios = getUsuarios();
  const usuario = usuarios.find((registro) => registro.correo === correo);

  if (!usuario) {
    mostrarMensajeLogin("Correo no registrado", "err");
    return;
  }

  if (usuario.contrasena !== contrasena) {
    mostrarMensajeLogin("Contraseña incorrecta", "err");
    return;
  }

  setUsuarioActivo(usuario);
  mostrarMensajeLogin(
    `Bienvenido/a, ${capitalizarNombre(usuario.nombre)}.`,
    "ok"
  );

  setTimeout(() => {
    window.location.href = "catalogo.html";
  }, REDIRECT_DELAY_MS);
}

if (loginForm) {
  loginForm.addEventListener("submit", manejarLogin);
}
