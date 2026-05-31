const loginForm = document.getElementById("loginForm");
const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");
const errorLoginEmail = document.getElementById("errorLoginEmail");
const errorLoginPassword = document.getElementById("errorLoginPassword");

const API_BASE_URL = "https://origenesdeployback.onrender.com";
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
 * Adapta la respuesta de la API al formato que usa el navbar en localStorage.
 * @param {{ token: string, email: string, nombre: string, rol: string }} data
 * @returns {{ nombre: string, correo: string, token: string, rol: string }}
 */
function mapearUsuarioSesion(data) {
  return {
    nombre: data.nombre,
    correo: data.email,
    token: data.token,
    rol: data.rol,
  };
}

/**
 * Valida credenciales y activa la sesión del usuario.
 * @param {SubmitEvent} event
 */
async function manejarLogin(event) {
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

  try {
    const respuesta = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: correo,
        password: contrasena,
      }),
    });

    if (!respuesta.ok) {
      mostrarMensajeLogin(MENSAJE_CREDENCIALES_INVALIDAS, "err");
      return;
    }

    const data = await respuesta.json();
    const usuario = mapearUsuarioSesion(data);

    setUsuarioActivo(usuario);
    mostrarMensajeLogin(
      `Inicio de sesión exitoso. Bienvenido/a, ${capitalizarNombre(usuario.nombre)}.`,
      "ok"
    );

    setTimeout(() => {
      window.location.href = "../index.html";
    }, REDIRECT_DELAY_MS);
  } catch (_) {
    mostrarMensajeLogin(
      "Error de conexión con el servidor. Verifica tu red e intenta de nuevo.",
      "err"
    );
  }
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