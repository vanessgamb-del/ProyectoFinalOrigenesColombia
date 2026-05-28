const loginForm = document.getElementById("loginForm");
const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");
const errorLoginEmail = document.getElementById("errorLoginEmail");
const errorLoginPassword = document.getElementById("errorLoginPassword");

const REDIRECT_DELAY_MS = 800;
const MENSAJE_CAMPO_VACIO = "El campo no puede estar vacío";
const MENSAJE_CREDENCIALES_INVALIDAS = "Usuario o contraseña inválidos";

/**
 * Muestra un mensaje global en el formulario de login.
 * @param {string} texto
 * @param {"ok"|"err"} tipo
 */
function mostrarMensajeLogin(texto, tipo) {
  if (!loginMessage) return;
  loginMessage.textContent = texto;
  loginMessage.classList.remove("is-error", "is-success");
  if (texto) {
    loginMessage.classList.add(tipo === "ok" ? "is-success" : "is-error");
  }
}

/**
 * Muestra un error debajo de un campo del formulario.
 * @param {HTMLElement|null} span
 * @param {string} texto
 */
function mostrarErrorCampo(span, texto) {
  if (!span) return;
  span.textContent = texto;
}

/**
 * Limpia el mensaje de error de un campo.
 * @param {HTMLElement|null} span
 */
function limpiarErrorCampo(span) {
  if (!span) return;
  span.textContent = "";
}

/**
 * Valida credenciales y activa la sesión del usuario.
 * @param {SubmitEvent} event
 */
function manejarLogin(event) {
  event.preventDefault();

  const correo = loginEmailInput.value.trim().toLowerCase();
  const contrasena = loginPasswordInput.value;

  let hayCamposVacios = false;
  if (!correo) {
    mostrarErrorCampo(errorLoginEmail, MENSAJE_CAMPO_VACIO);
    hayCamposVacios = true;
  } else {
    limpiarErrorCampo(errorLoginEmail);
  }

  if (!contrasena) {
    mostrarErrorCampo(errorLoginPassword, MENSAJE_CAMPO_VACIO);
    hayCamposVacios = true;
  } else {
    limpiarErrorCampo(errorLoginPassword);
  }

  if (hayCamposVacios) {
    mostrarMensajeLogin("", "err");
    return;
  }

  const usuarios = getUsuarios();
  const usuario = usuarios.find(
    (registro) => registro.correo.toLowerCase() === correo
  );

  if (!usuario || usuario.contrasena !== contrasena) {
    mostrarMensajeLogin(MENSAJE_CREDENCIALES_INVALIDAS, "err");
    return;
  }

  setUsuarioActivo(usuario);
  mostrarMensajeLogin(
    `Inicio de sesión exitoso. Bienvenido/a, ${capitalizarNombre(usuario.nombre)}.`,
    "ok"
  );

  setTimeout(() => {
    window.location.href = "../index.html";
  }, REDIRECT_DELAY_MS);
}

if (loginForm) {
  loginForm.addEventListener("submit", manejarLogin);
}

if (loginEmailInput) {
  loginEmailInput.addEventListener("input", () =>
    limpiarErrorCampo(errorLoginEmail)
  );
}

if (loginPasswordInput) {
  loginPasswordInput.addEventListener("input", () =>
    limpiarErrorCampo(errorLoginPassword)
  );
}
