// ============================================================
// script.js — Lógica de interacción para SoyMr Playlists
// ============================================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // ---------- INICIALIZAR ICONOS DE LUCIDE ----------
    // Reemplaza los elementos <i data-lucide="..."> por SVGs
    if (window.lucide) {
        lucide.createIcons();
    }

    // ---------- VARIABLES GLOBALES ----------
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const playlistCards = document.querySelectorAll('.playlist-card');
    const yearSpan = document.getElementById('year');

    // ---------- NAVBAR: EFECTO SCROLL ----------
    function handleNavbarScroll() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Ejecutar al cargar
    handleNavbarScroll();

    // Escuchar el evento scroll
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ---------- NAVBAR: MENÚ HAMBURGUESA ----------
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');

        // Actualizar aria-expanded
        const isOpen = navMenu.classList.contains('open');
        hamburger.setAttribute('aria-expanded', isOpen);

        // Alternar bloqueo del scroll del body
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navbar.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('open')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // ---------- NAVBAR: ENLACE ACTIVO SEGÚN SECCIÓN ----------
    // Intersection Observer para resaltar la sección visible
    const sections = document.querySelectorAll('section[id]');
    const navLinkMap = {};

    navLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1); // quitar '#'
        navLinkMap[targetId] = link;
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Quitar 'active' de todos
                navLinks.forEach(link => link.classList.remove('active'));
                // Añadir 'active' al enlace correspondiente
                const activeLink = navLinkMap[entry.target.id];
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ---------- PORTADAS DE PLAYLIST: ABRIR ENLACE AL HACER CLIC ----------
    // La portada completa abre la playlist en una nueva pestaña
    document.querySelectorAll('.card-cover').forEach(cover => {
        cover.addEventListener('click', () => {
            const card = cover.closest('.playlist-card');
            const link = card.querySelector('.btn-spotify');
            if (link) {
                window.open(link.href, '_blank', 'noopener,noreferrer');
            }
        });
    });

    // ---------- TÍTULO DE PLAYLIST: ABRIR ENLACE AL HACER CLIC ----------
    document.querySelectorAll('.card-title').forEach(title => {
        title.addEventListener('click', () => {
            const card = title.closest('.playlist-card');
            const link = card.querySelector('.btn-spotify');
            if (link) {
                window.open(link.href, '_blank', 'noopener,noreferrer');
            }
        });
    });

    // ---------- AÑO DINÁMICO EN FOOTER ----------
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ---------- ACCESIBILIDAD: NAVEGACIÓN CON TECLADO ----------
    // Permitir abrir playlists con la tecla Enter/Space en la tarjeta
    playlistCards.forEach(card => {
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const link = card.querySelector('.btn-spotify');
                if (link) {
                    window.open(link.href, '_blank', 'noopener,noreferrer');
                }
            }
        });
    });

    // ---------- SMOOTH SCROLL PARA ENLACES DE NAVEGACIÓN ----------
    // Aunque ya se usa CSS scroll-behavior: smooth, hacemos un fallback
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 60;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- DETECCIÓN DE PREFERENCIA DE MOVIMIENTO REDUCIDO ----------
    // Si el usuario prefiere menos animaciones, desactivamos las flotantes
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        // Desactivar animaciones flotantes
        document.querySelectorAll('.hero-profile-img, .hero-image-ring, .scroll-indicator, .hero-image-glow').forEach(el => {
            el.style.animation = 'none';
        });
        document.querySelectorAll('.hero-glow').forEach(el => {
            el.style.animation = 'none';
        });
    }

    // ---------- LOG EN CONSOLA (opcional, para depuración) ----------
    console.log('🎵 SoyMr Playlists — Página cargada correctamente');
    console.log('📋 Playlists disponibles:', playlistCards.length);
    console.log('🎮 Servidor Discord listo para conexión');
});
