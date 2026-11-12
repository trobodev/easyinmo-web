/* =========================================================
   Easyinmo · Comportamiento de la página
   ========================================================= */

// 1. Menú móvil: abre y cierra la navegación en pantallas pequeñas
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const abierto = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', abierto);
  navToggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});

// Cierra el menú al pulsar cualquier enlace
nav.querySelectorAll('a').forEach(enlace => {
  enlace.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// 2. Sombra en la cabecera al hacer scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 10);
});

// 3. Animación de aparición: añade .is-visible cuando el elemento entra en pantalla
const observer = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('is-visible');
      observer.unobserve(entrada.target); // solo se anima una vez
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 4. Año actual en el pie de página
document.getElementById('year').textContent = new Date().getFullYear();

// 5. Envío del formulario a Web3Forms sin recargar la página
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', async (evento) => {
  evento.preventDefault(); // evita el envío "clásico" que recarga la página

  // Validación nativa del navegador (campos required, formato de email…)
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const boton = form.querySelector('button[type="submit"]');
  boton.disabled = true;
  boton.textContent = 'Enviando…';
  status.className = 'form__status';
  status.textContent = '';

  try {
    const respuesta = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const datos = await respuesta.json();

    if (datos.success) {
      status.textContent = '¡Gracias! Te avisaremos en cuanto Easyinmo esté disponible.';
      status.classList.add('ok');
      form.reset();
    } else {
      throw new Error(datos.message);
    }
  } catch (error) {
    status.textContent = 'No se ha podido enviar el mensaje. Inténtalo de nuevo más tarde.';
    status.classList.add('error');
  } finally {
    boton.disabled = false;
    boton.textContent = 'Enviar';
  }
});
