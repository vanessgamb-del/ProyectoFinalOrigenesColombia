document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img");
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterMessage = document.getElementById("newsletterMessage");

  images.forEach((image) => {
    if (!image.hasAttribute("loading")) {
      image.setAttribute("loading", "lazy");
    }

    if (!image.hasAttribute("decoding")) {
      image.setAttribute("decoding", "async");
    }
  });

  if (newsletterForm && newsletterEmail && newsletterMessage) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const emailValue = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailValue)) {
        newsletterMessage.textContent = "Ingresa un correo válido.";
        return;
      }

      newsletterMessage.textContent = "Gracias por suscribirte.";
      newsletterForm.reset();
    });
  }
});