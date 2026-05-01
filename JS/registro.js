const form = document.getElementById("contactForm");
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("celular");
const countryCodeSelect = document.getElementById("indicativo");
const passInput = document.getElementById("passwordInput");
const verificarPass = document.getElementById("verificar-passwordInput");

const nombreError = document.getElementById("errorNombreCompleto");
const emailError = document.getElementById("errorCorreo");
const phoneError = document.getElementById("errorCelular");
const errorContrasena = document.getElementById("errorContrasena");
const errorContrasena2 = document.getElementById("verificar-errorContrasena");
const successMessage = document.getElementById("mensajeExito");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{1,11}$/;

function setError (element, message) {
  element.textContent = message;
};

function clearError (element){
  element.textContent = "";
};

// Listener para funciones
verificarPass.addEventListener("input",sonIguales);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", sanitizePhoneInput);
countryCodeSelect.addEventListener("change", validatePhone);
form.addEventListener("submit", registrarse );

// funciones para contraseña 

function verContrasena(password,btn){
  const input = document.getElementById(password);
  const icon = btn.querySelector("i");

  if(input.type === "password"){
    input.type = "text";
    icon.className = "fa-solid fa-eye-slash";
  }else{
    input.type = "password";
    icon.className = "fa-solid fa-eye";
  }
}

function sonIguales(){
  let verificarPassString = verificarPass.value;
  let passString = passInput.value;
      if(verificarPassString !== passString ){
        errorContrasena.textContent="Las contraseñas no son iguales";
        errorContrasena2.textContent="Las contraseñas no son iguales";
        return;
    }
    else{
       errorContrasena.textContent="";
       errorContrasena2.textContent="";
       return;
    }

}

// funciones de validación del formulario

function validacionNombre(){
  const nombre= nombreInput.value.trim();

  if(!nombre){
    setError(nombreError,"El nombre es obligatorio");
    return false;
  }
  clearError(nombreError);
    return true;
}

function validateEmail (){
  const email = emailInput.value.trim();

  if (!email) {
    setError(emailError, "El correo es obligatorio.");
    return false;
  }

  if (!emailRegex.test(email)) {
    setError(emailError, "Ingresa un correo válido.");
    return false;
  }

  clearError(emailError);
  return true;
};

function validatePhone(){
    const phone = phoneInput.value.trim();
    const countryCode = countryCodeSelect.value;

    if (!countryCode) {
      setError(phoneError, "Selecciona un indicativo.");
      return false;
    }

    if (!phone) {
      setError(phoneError, "El celular es obligatorio.");
      return false;
    }

    if (!phoneRegex.test(phone)) {
      setError(phoneError, "Solo se permiten números y máximo 11 dígitos.");
      return false;
    }

    clearError(phoneError);
    return true;
  };
  function sanitizePhoneInput(event){
    const numericValue = event.target.value.replace(/\D/g, "").slice(0, 11);
    event.target.value = numericValue;
    validatePhone();
  };

  function validacionContrasena(){
    const contra= passInput.value.trim();

    if(!contra){
      setError(errorContrasena,"La contraseña es obligatoria");
      return false;
  }

  clearError(errorContrasena);
  clearError(errorContrasena2);
  return true;
}
function registrarse(e) {
  // evita que se recargue la página
  e.preventDefault();
  //realiza las validaciones antes de continuar
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isNameValid = validacionNombre();
  const isPassValid = validacionContrasena();

  if (!isEmailValid || !isPhoneValid || !isNameValid || !isPassValid) {
    return;
  }

  usuariosRegistrados = getUsarios();
  const emailExiste = usuariosRegistrados.some(
  user => user.correo === emailInput.value
);
  if(emailExiste){
    alert("Correo registrado previamente");
    return;
  }
  

  const usuarioData = {
    nombre: nombreInput.value,
    correo : emailInput.value,
    telefono: phoneInput.value,
    indicativo:countryCodeSelect.value,
    contrasena: passInput.value,
  }

  console.log(usuarioData);
  usuariosRegistrados.push(usuarioData);
  saveUsuario(usuariosRegistrados);

  };
