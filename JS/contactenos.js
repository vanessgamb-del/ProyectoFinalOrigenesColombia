document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("nombre");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("celular");
  const messageInput = document.getElementById("mensaje");
  const countryCodeSelect = document.getElementById("indicativo");

  const nameError = document.getElementById("errorNombreCompleto");
  const emailError = document.getElementById("errorCorreo");
  const phoneError = document.getElementById("errorCelular");
  const messageError = document.getElementById("errorMensaje");
  const successMessage = document.getElementById("mensajeExito");

  if (
    !form ||
    !nameInput ||
    !emailInput ||
    !phoneInput ||
    !messageInput ||
    !countryCodeSelect ||
    !nameError ||
    !emailError ||
    !phoneError ||
    !messageError ||
    !successMessage
  ) {
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{1,11}$/;

  /**
   * Muestra un mensaje de error en un campo del formulario.
   * @param {HTMLElement} element
   * @param {string} message
   */
  const setError = (element, message) => {
    element.textContent = message;
  };

  /**
   * Limpia el mensaje de error de un campo.
   * @param {HTMLElement} element
   */
  const clearError = (element) => {
    element.textContent = "";
  };

  /**
   * Valida el nombre completo.
   * @returns {boolean}
   */
  const validateName = () => {
    const name = nameInput.value.trim();

    if (!name) {
      setError(nameError, "El nombre es obligatorio.");
      return false;
    }

    if (name.length < 3) {
      setError(nameError, "Ingresa un nombre válido.");
      return false;
    }

    clearError(nameError);
    return true;
  };

  /**
   * Valida el correo electrónico con regex.
   * @returns {boolean}
   */
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

  /**
   * Valida el número de celular con indicativo.
   * @returns {boolean}
   */
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

  /**
   * Valida que el mensaje no esté vacío.
   * @returns {boolean}
   */
  const validateMessage = () => {
    const message = messageInput.value.trim();

    if (!message) {
      setError(messageError, "El mensaje es obligatorio.");
      return false;
    }

    if (message.length < 10) {
      setError(messageError, "El mensaje debe tener al menos 10 caracteres.");
      return false;
    }

    clearError(messageError);
    return true;
  };

  /**
   * Restringe el input de teléfono a dígitos.
   * @param {InputEvent} event
   */
  const sanitizePhoneInput = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "").slice(0, 11);
    event.target.value = numericValue;
    validatePhone();
  };

  nameInput.addEventListener("input", validateName);
  emailInput.addEventListener("input", validateEmail);
  phoneInput.addEventListener("input", sanitizePhoneInput);
  messageInput.addEventListener("input", validateMessage);
  countryCodeSelect.addEventListener("change", validatePhone);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
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
