// ==================== CAROUSEL FUNCTIONALITY ====================

class Carousel {
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.track = this.carousel.querySelector('.carousel-track');
        this.slides = Array.from(this.track.children);
        this.nextButton = this.carousel.querySelector('.next');
        this.prevButton = this.carousel.querySelector('.prev');
        this.dotsContainer = this.carousel.querySelector('.carousel-dots');
        
        this.currentIndex = 0;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        // Crear dots
        this.createDots();
        
        // Event listeners
        this.nextButton.addEventListener('click', () => this.moveToNext());
        this.prevButton.addEventListener('click', () => this.moveToPrev());
        
        // Dots click
        this.dots = Array.from(this.dotsContainer.children);
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.moveToSlide(index));
        });
        
        // Touch events para móvil
        this.setupTouchEvents();
        
        // Auto-play (opcional)
        this.startAutoPlay();
        
        // Pausar auto-play al hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Keyboard navigation
        this.setupKeyboardNav();
    }
    
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Ir a imagen ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            this.dotsContainer.appendChild(dot);
        });
    }
    
    moveToSlide(targetIndex) {
        if (this.isAnimating || targetIndex === this.currentIndex) return;
        
        this.isAnimating = true;
        
        // Calcular transformación
        const amountToMove = -100 * targetIndex;
        this.track.style.transform = `translateX(${amountToMove}%)`;
        
        // Actualizar dots
        this.updateDots(targetIndex);
        
        // Actualizar índice
        this.currentIndex = targetIndex;
        
        // Resetear animación
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }
    
    moveToNext() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.moveToSlide(nextIndex);
    }
    
    moveToPrev() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.moveToSlide(prevIndex);
    }
    
    updateDots(targetIndex) {
        this.dots.forEach(dot => dot.classList.remove('active'));
        this.dots[targetIndex].classList.add('active');
    }
    
    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diff = startX - currentX;
            
            // Si el swipe es mayor a 50px
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.moveToNext();
                } else {
                    this.moveToPrev();
                }
            }
            
            isDragging = false;
        });
    }
    
    setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // Solo si el carousel está visible en viewport
            const rect = this.carousel.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (!isVisible) return;
            
            if (e.key === 'ArrowLeft') {
                this.moveToPrev();
            } else if (e.key === 'ArrowRight') {
                this.moveToNext();
            }
        });
    }
    
    startAutoPlay(interval = 5000) {
        this.stopAutoPlay(); // Limpiar cualquier intervalo previo
        this.autoPlayInterval = setInterval(() => {
            this.moveToNext();
        }, interval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos los carousels
    const carousels = document.querySelectorAll('.carousel');
    
    if (carousels.length === 0) {
        console.warn('⚠️ No se encontraron carruseles en la página');
        return;
    }
    
    carousels.forEach(carouselElement => {
        new Carousel(carouselElement);
    });
    
    console.log(`✅ ${carousels.length} carrusel(es) inicializado(s)`);
});

// ==================== LAZY LOADING PARA IMÁGENES ====================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    // Observar imágenes con data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== PAUSE ON VISIBILITY CHANGE ====================

document.addEventListener('visibilitychange', () => {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carouselEl => {
        const carouselInstance = carouselEl.carouselInstance;
        if (!carouselInstance) return;
        
        if (document.hidden) {
            carouselInstance.stopAutoPlay();
        } else {
            carouselInstance.startAutoPlay();
        }
    });
});

// ==================== END ====================