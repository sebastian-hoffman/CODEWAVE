const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

const contactForm = document.getElementById("contactForm");
const contactSubmit = document.getElementById("contactSubmit");
const formStatus = document.getElementById("formStatus");

if (contactForm && contactSubmit && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const payload = {
      nombre: String(formData.get("nombre") || "").trim(),
      empresa: String(formData.get("empresa") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      mensaje: String(formData.get("mensaje") || "").trim()
    };

    formStatus.textContent = "Enviando consulta...";
    formStatus.dataset.state = "loading";
    contactSubmit.disabled = true;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "No pudimos enviar la consulta.");
      }

      contactForm.reset();
      formStatus.textContent = result.message || "Consulta enviada. Te responderemos a la brevedad.";
      formStatus.dataset.state = "success";
    } catch (error) {
      formStatus.textContent = error.message || "No pudimos enviar la consulta.";
      formStatus.dataset.state = "error";
    } finally {
      contactSubmit.disabled = false;
    }
  });
}
