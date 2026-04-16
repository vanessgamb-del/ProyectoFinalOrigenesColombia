document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".team-card");

  if (!cards.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  cards.forEach((card) => observer.observe(card));
});

const formulario = document.getElementById("contactenos");
const aviso = document.getElementById("mensajeExito");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = new FormData(formulario);
  const respuesta = await fetch(formulario.action, {
    method: formulario.method,
    body: datos,
    headers: { 'Accept': 'application/json' }
  });

  if (respuesta.ok) {
    formulario.style.display = "none";
    aviso.style.display = "block";
  } else {
    alert("Hubo un error al enviar. Inténtalo de nuevo.");
  }
});