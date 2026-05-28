const registerForm = document.getElementById("registerForm");
const fullNameInput = document.getElementById("fullName");
const registerEmailInput = document.getElementById("registerEmail");
const registerPhoneInput = document.getElementById("registerPhone");
const registerPasswordInput = document.getElementById("registerPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const registerMessage = document.getElementById("registerMessage");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{7,11}$/;
const MIN_PASSWORD_LENGTH = 6;

/**
 * Muestra un mensaje de feedback en el formulario de registro.
 * @param {string} texto
 * @param {"ok"|"err"} tipo
 */
function mostrarMensajeRegistro(texto, tipo) {
  if (!registerMessage) return;
  registerMessage.textContent = texto;
  registerMessage.classList.remove("is-error", "is-success");
  registerMessage.classList.add(tipo === "ok" ? "is-success" : "is-error");
}

/**
 * Valida los campos del formulario de registro.
 * @param {string} nombre
 * @param {string} correo
 * @param {string} telefono
 * @param {string} contrasena
 * @param {string} confirmacion
 * @returns {boolean}
 */
function validarFormularioRegistro(nombre, correo, telefono, contrasena, confirmacion) {
  if (!nombre) {
    mostrarMensajeRegistro("El nombre es obligatorio.", "err");
    return false;
  }
  if (!emailRegex.test(correo)) {
    mostrarMensajeRegistro("Ingresa un correo válido.", "err");
    return false;
  }
  if (!phoneRegex.test(telefono)) {
    mostrarMensajeRegistro("Ingresa un teléfono válido (7 a 11 dígitos).", "err");
    return false;
  }
  if (contrasena.length < MIN_PASSWORD_LENGTH) {
    mostrarMensajeRegistro(
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      "err"
    );
    return false;
  }
  if (contrasena !== confirmacion) {
    mostrarMensajeRegistro("Las contraseñas no coinciden.", "err");
    return false;
  }
  return true;
}

/**
 * Procesa el envío del formulario de registro y guarda el usuario en localStorage.
 * @param {SubmitEvent} event
 */
function manejarRegistro(event) {
  event.preventDefault();

  const nombre = fullNameInput.value.trim();
  const correo = registerEmailInput.value.trim().toLowerCase();
  const telefono = registerPhoneInput.value.trim();
  const contrasena = registerPasswordInput.value;
  const confirmacion = confirmPasswordInput.value;

  if (!validarFormularioRegistro(nombre, correo, telefono, contrasena, confirmacion)) {
    return;
  }

  const usuarios = getUsuarios();
  const correoExiste = usuarios.some((usuario) => usuario.correo === correo);
  if (correoExiste) {
    mostrarMensajeRegistro("Correo ya registrado.", "err");
    return;
  }

  const nuevoUsuario = { nombre, correo, telefono, contrasena };
  saveUsuarios([...usuarios, nuevoUsuario]);

  mostrarMensajeRegistro("Cuenta creada correctamente. Redirigiendo…", "ok");
  registerForm.reset();
  setTimeout(() => {
    window.location.href = "login.html";
  }, 800);
}

if (registerForm) {
  registerForm.addEventListener("submit", manejarRegistro);
}

if (registerPhoneInput) {
  registerPhoneInput.addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/\D/g, "").slice(0, 11);
  });
}
