document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const celularInput = document.getElementById("celular");
  const indicativoSelect = document.getElementById("indicativo");

  const errorCorreo = document.getElementById("errorCorreo");
  const errorCelular = document.getElementById("errorCelular");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  celularInput.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");
    event.target.value = value.slice(0, 11);
    validatePhone();
  });

  emailInput.addEventListener("input", () => {
    validateEmail();
  });

  indicativoSelect.addEventListener("change", () => {
    validatePhone();
  });

  form.addEventListener("submit", (event) => {
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();

    if (!isEmailValid || !isPhoneValid) {
      event.preventDefault();
    }
  });

  function validateEmail() {
    const email = emailInput.value.trim();

    if (email === "") {
      errorCorreo.textContent = "El correo es obligatorio.";
      return false;
    }

    if (!emailRegex.test(email)) {
      errorCorreo.textContent = "Ingresa un correo válido.";
      return false;
    }

    errorCorreo.textContent = "";
    return true;
  }

  function validatePhone() {
    const celular = celularInput.value.trim();
    const indicativo = indicativoSelect.value;

    if (indicativo === "") {
      errorCelular.textContent = "Selecciona un indicativo.";
      return false;
    }

    if (celular === "") {
      errorCelular.textContent = "El celular es obligatorio.";
      return false;
    }

    if (!/^\d{1,11}$/.test(celular)) {
      errorCelular.textContent = "Solo se permiten números y máximo 11 dígitos.";
      return false;
    }

    errorCelular.textContent = "";
    return true;
  }
});