const registerForm = document.getElementById("registerForm");
const fullNameInput = document.getElementById("fullName");
const registerEmailInput = document.getElementById("registerEmail");
const registerPasswordInput = document.getElementById("registerPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const registerMessage = document.getElementById("registerMessage");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function mostrarMensajeRegistro(texto, tipo) {
  if (!registerMessage) return;
  registerMessage.textContent = texto;
  registerMessage.classList.remove("is-error", "is-success");
  registerMessage.classList.add(tipo === "ok" ? "is-success" : "is-error");
}

function validarFormularioRegistro(nombre, correo, contrasena, confirmacion) {
  if (!nombre) {
    mostrarMensajeRegistro("El nombre es obligatorio.", "err");
    return false;
  }
  if (!emailRegex.test(correo)) {
    mostrarMensajeRegistro("Ingresa un correo válido.", "err");
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

function manejarRegistro(event) {
  event.preventDefault();

  const nombre = fullNameInput.value.trim();
  // Normalizamos el correo a minúsculas para que el login pueda buscar
  // sin importar cómo lo escriba el usuario al iniciar sesión.
  const correo = registerEmailInput.value.trim().toLowerCase();
  const contrasena = registerPasswordInput.value;
  const confirmacion = confirmPasswordInput.value;

  if (!validarFormularioRegistro(nombre, correo, contrasena, confirmacion)) {
    return;
  }

  const usuarios = getUsuarios();
  const correoExiste = usuarios.some((usuario) => usuario.correo === correo);
  if (correoExiste) {
    mostrarMensajeRegistro("Correo ya registrado.", "err");
    return;
  }

  const nuevoUsuario = { nombre, correo, contrasena };
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
