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

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const nombre = String(formData.get("nombre") || "").trim();
    const empresa = String(formData.get("empresa") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const mensaje = String(formData.get("mensaje") || "").trim();

    const subject = encodeURIComponent(`Nueva consulta web - ${empresa}`);
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nEmpresa: ${empresa}\nEmail: ${email}\n\nObjetivo del proyecto:\n${mensaje}`
    );

    window.location.href = `mailto:contacto@codewave.ar?subject=${subject}&body=${body}`;
  });
}
