const verificarPass = document.getElementById("verificar-passwordInput");
const passInput = document.getElementById("passwordInput");
const errorContrasena = document.getElementById("errorContrasena");
const errorContrasena2 = document.getElementById("verificar-errorContrasena");

verificarPass.addEventListener("input",sonIguales);

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
      if(verificarPass !== passString ){
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





document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("celular");
  const countryCodeSelect = document.getElementById("indicativo");

  const emailError = document.getElementById("errorCorreo");
  const phoneError = document.getElementById("errorCelular");
  const successMessage = document.getElementById("mensajeExito");

  if (
    !form ||
    !emailInput ||
    !phoneInput ||
    !countryCodeSelect ||
    !emailError ||
    !phoneError ||
    !successMessage
  ) {
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{1,11}$/;

  const setError = (element, message) => {
    element.textContent = message;
  };

  const clearError = (element) => {
    element.textContent = "";
  };

  const validateEmail = () => {
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

  const validatePhone = () => {
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

  const sanitizePhoneInput = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "").slice(0, 11);
    event.target.value = numericValue;
    validatePhone();
  };

  emailInput.addEventListener("input", validateEmail);
  phoneInput.addEventListener("input", sanitizePhoneInput);
  countryCodeSelect.addEventListener("change", validatePhone);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();

    if (!isEmailValid || !isPhoneValid) {
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        alert("Hubo un error al enviar el formulario. Inténtalo de nuevo.");
        return;
      }

      form.reset();
      form.style.display = "none";
      successMessage.style.display = "block";
    } catch (error) {
      alert("No hay conexión con el servidor.");
    }
  });
});