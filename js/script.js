// ==================== CONFIGURACIÓN ====================
const config = {
    animationDuration: 600,
    scrollOffset: 80
};

// Traducciones
const translations = {
    es: {
        nav: {
            home: 'Inicio',
            about: 'Quiénes Somos',
            services: 'Servicios',
            projects: 'Trabajos',
            contact: 'Contacto'
        },
        hero: {
            title: 'Pulidos Sabando',
            subtitle: 'Expertos en Pulido y Abrillantado de Suelos',
            cta: 'Solicitar Presupuesto'
        }
    },
    en: {
        nav: {
            home: 'Home',
            about: 'About Us',
            services: 'Services',
            projects: 'Projects',
            contact: 'Contact'
        },
        hero: {
            title: 'Pulidos Sabando',
            subtitle: 'Floor Polishing and Brightening Experts',
            cta: 'Request Quote'
        }
    }
};

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupScrollAnimations();
    setupSmoothScrolling();
    setupHeaderScroll();
    setupContactForm();
    setupPortfolioFilter();
    setupFAQ();
    setupScrollToTop();
    setupMobileMenu();
    setupLanguageSelector();
    logInit();
}

// ==================== SELECTOR DE IDIOMA ====================
function setupLanguageSelector() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('language') || 'es';
    
    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => {
            const selectedLang = btn.dataset.lang;
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            localStorage.setItem('language', selectedLang);
            changeLanguage(selectedLang);
        });
    });
}

function changeLanguage(lang) {
    const trans = translations[lang];
    
    const navLinks = document.querySelectorAll('nav ul li a');
    const navKeys = ['home', 'about', 'services', 'projects', 'contact'];
    navLinks.forEach((link, index) => {
        if (trans.nav[navKeys[index]]) {
            link.textContent = trans.nav[navKeys[index]];
        }
    });
    
    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero p');
    const heroCta = document.querySelector('.hero .cta-button');
    
    if (heroTitle) heroTitle.textContent = trans.hero.title;
    if (heroSubtitle) heroSubtitle.textContent = trans.hero.subtitle;
    if (heroCta) heroCta.textContent = trans.hero.cta;
    
    document.documentElement.lang = lang;
}

// ==================== ANIMACIONES DE SCROLL MEJORADAS ====================
function setupScrollAnimations() {
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    const options = {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añadir la clase visible con un pequeño delay para mejor efecto
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 50);
            }
        });
    }, options);

    // Observar todos los elementos con fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) {
        console.warn('⚠️ No se encontraron elementos con clase .fade-in');
    } else {
        console.log(`✅ Observando ${fadeElements.length} elementos .fade-in`);
        fadeElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Re-observar en resize si cambia de desktop a móvil o viceversa
    let previousWidth = window.innerWidth;
    window.addEventListener('resize', debounce(() => {
        const currentWidth = window.innerWidth;
        const wasMobile = previousWidth <= 768;
        const isNowMobile = currentWidth <= 768;
        
        if (wasMobile !== isNowMobile) {
            observer.disconnect();
            setupScrollAnimations();
        }
        previousWidth = currentWidth;
    }, 250));
}

// ==================== SMOOTH SCROLLING ====================
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - config.scrollOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== HEADER SCROLL ====================
function setupHeaderScroll() {
    window.addEventListener('scroll', debounce(() => {
        const header = document.querySelector('header');
        if (!header) return;

        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
    }, 10));
}

// ==================== FORMULARIO DE CONTACTO ====================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formMessage = document.getElementById('formMessage');
        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        
        const formData = {
            name: document.getElementById('name')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value,
            service: document.getElementById('service')?.value,
            message: document.getElementById('message')?.value
        };

        const locationField = document.getElementById('location');
        const surfaceField = document.getElementById('surface');
        const areaField = document.getElementById('area');
        
        if (locationField) formData.location = locationField.value;
        if (surfaceField) formData.surface = surfaceField.value;
        if (areaField) formData.area = areaField.value;

        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        submitButton.style.opacity = '0.6';

        try {
            const response = await fetch('https://formsubmit.co/ajax/aimaninstituto2020@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    _subject: 'Nueva solicitud de presupuesto - Pulidos Sabando',
                    _template: 'table'
                })
            });

            if (response.ok) {
                showFormMessage(formMessage, 'Solicitud enviada correctamente. Nos pondremos en contacto pronto.', 'success');
                this.reset();
            } else {
                throw new Error('Error en el envío');
            }
        } catch (error) {
            showFormMessage(formMessage, 'Error al enviar. Por favor, inténtalo de nuevo o contáctanos directamente.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.style.opacity = '1';
        }
    });
}

function showFormMessage(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `form-message ${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
            element.style.opacity = '1';
        }, 300);
    }, 5000);
}

// ==================== FILTRO DE PORTFOLIO ====================
function setupPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item, .project-card');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            portfolioItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.classList.add('visible');
                    item.style.display = 'block';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                        item.classList.add('hidden');
                        item.classList.remove('visible');
                    }, 300);
                }
            });
        });
    });
}

// ==================== PROJECT MODAL ====================
function openModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target === modal) closeModal();
};

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') closeModal();
});

// ==================== FAQ ACCORDION ====================
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            item.classList.toggle('active');
        });
    });
}

// ==================== SCROLL TO TOP ====================
function setupScrollToTop() {
    let scrollBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.setAttribute('aria-label', 'Volver arriba');
        document.body.appendChild(scrollBtn);
    }

    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 400) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }, 100));

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
    });
}

// ==================== MOBILE MENU ====================
function setupMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const navUl = document.querySelector('nav ul');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    
    if (!toggleBtn || !nav || !navUl) return;

    // Remover listeners anteriores para evitar duplicados
    const newToggleBtn = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);

    // Click en el botón hamburguesa
    newToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = nav.classList.contains('mobile-open');

        if (isOpen) {
            nav.classList.remove('mobile-open');
            if (hamburgerIcon) hamburgerIcon.textContent = '☰';
            newToggleBtn.setAttribute('aria-expanded', 'false');
        } else {
            nav.classList.add('mobile-open');
            if (hamburgerIcon) hamburgerIcon.textContent = '✕';
            newToggleBtn.setAttribute('aria-expanded', 'true');
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('mobile-open');
            if (hamburgerIcon) hamburgerIcon.textContent = '☰';
            newToggleBtn.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !newToggleBtn.contains(e.target)) {
            if (nav.classList.contains('mobile-open')) {
                nav.classList.remove('mobile-open');
                if (hamburgerIcon) hamburgerIcon.textContent = '☰';
                newToggleBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// ==================== VALIDACIÓN ====================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\+\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 9;
}

const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

if (emailInput) {
    emailInput.addEventListener('blur', function() {
        this.style.borderColor = (this.value && !validateEmail(this.value)) ? '#f44336' : 'var(--border-color)';
    });
}

if (phoneInput) {
    phoneInput.addEventListener('blur', function() {
        this.style.borderColor = (this.value && !validatePhone(this.value)) ? '#f44336' : 'var(--border-color)';
    });
}

// ==================== UTILITIES ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// ==================== RESIZE HANDLER ====================
window.addEventListener('resize', debounce(() => {
    setupMobileMenu();
}, 250));

// ==================== INIT LOG ====================
function logInit() {
    console.log('%c Pulidos Sabando ', 'font-size: 18px; font-weight: 300; color: #2d2d2d;');
    console.log('%c Sitio web cargado correctamente', 'font-size: 12px; color: #7a7a7a;');
}

// ==================== EXPORTAR FUNCIONES ====================
window.openModal = openModal;
window.closeModal = closeModal;

// ==================== END ====================