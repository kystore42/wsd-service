const DEFAULT_LANG = 'en';
const menuBtn = document.getElementById('menuBtn');
        const navMenu = document.getElementById('navMenu');
        const mobileOverlay = document.getElementById('mobileMenuOverlay');
        const mobileCloseBtn = document.getElementById('mobileCloseBtn');
        const menuIcon = document.getElementById('menuIcon');
        
        function openMobileMenu() {
            if (window.innerWidth < 768) {
                navMenu.classList.remove('hidden');
                navMenu.classList.add('active');
                mobileOverlay.classList.add('active');
                menuIcon.textContent = '×';
                document.body.style.overflow = 'hidden';
            }
        }
        
        function closeMobileMenu() {
            navMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            menuIcon.textContent = '☰';
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                if (window.innerWidth < 768) {
                    navMenu.classList.add('hidden');
                }
            }, 400);
        }
        
        menuBtn?.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        mobileCloseBtn?.addEventListener('click', closeMobileMenu);
        mobileOverlay?.addEventListener('click', closeMobileMenu);
        
        document.querySelectorAll('#navMenu a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 768) {
                    closeMobileMenu();
                }
            });
        });
        
        document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const lang = this.getAttribute('data-mobile-lang');
                setLanguage(lang);
                
                document.querySelectorAll('.mobile-lang-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                updateActiveLanguage(lang);
            });
        });
        
        window.addEventListener('DOMContentLoaded', function() {
            const currentLang = localStorage.getItem('siteLang') || 'en';
            document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
                if (btn.getAttribute('data-mobile-lang') === currentLang) {
                    btn.classList.add('active');
                }
            });
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                navMenu.classList.remove('active', 'hidden');
                navMenu.classList.add('md:flex');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
                menuIcon.textContent = '☰';
            } else {
                navMenu.classList.add('hidden');
            }
        });
        
        (function() {
            const track = document.getElementById('testimonialsTrack');
            const slides = document.querySelectorAll('.testimonial-slide');
            const prevBtn = document.getElementById('testimonialsCarouselPrev');
            const nextBtn = document.getElementById('testimonialsCarouselNext');
            const navContainer = document.getElementById('testimonialsCarouselNav');
            
            if (!track || !slides.length) return;
            
            let currentIndex = 0;
            let slidesToShow = 1;
            let autoplayInterval;
            
            function updateSlidesToShow() {
                if (window.innerWidth >= 1024) {
                    slidesToShow = 3;
                } else if (window.innerWidth >= 768) {
                    slidesToShow = 2;
                } else {
                    slidesToShow = 1;
                }
            }
            
            function createNavDots() {
                navContainer.innerHTML = '';
                const totalPages = Math.ceil(slides.length / slidesToShow);
                for (let i = 0; i < totalPages; i++) {
                    const dot = document.createElement('button');
                    dot.setAttribute('aria-label', `Go to page ${i + 1}`);
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => goToSlide(i * slidesToShow));
                    navContainer.appendChild(dot);
                }
            }
            
            function updateNavDots() {
                const dots = navContainer.querySelectorAll('button');
                const currentPage = Math.floor(currentIndex / slidesToShow);
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentPage);
                });
            }
            
            function goToSlide(index) {
                const maxIndex = slides.length - slidesToShow;
                currentIndex = Math.max(0, Math.min(index, maxIndex));
                const offset = -(currentIndex * (100 / slidesToShow));
                track.style.transform = `translateX(${offset}%)`;
                updateNavDots();
            }
            
            function nextSlide() {
                if (currentIndex < slides.length - slidesToShow) {
                    goToSlide(currentIndex + 1);
                } else {
                    goToSlide(0);
                }
            }
            
            function prevSlide() {
                if (currentIndex > 0) {
                    goToSlide(currentIndex - 1);
                } else {
                    goToSlide(slides.length - slidesToShow);
                }
            }
            
            function startAutoplay() {
                autoplayInterval = setInterval(nextSlide, 5000);
            }
            
            function stopAutoplay() {
                clearInterval(autoplayInterval);
            }
            
            prevBtn?.addEventListener('click', () => {
                prevSlide();
                stopAutoplay();
                startAutoplay();
            });
            
            nextBtn?.addEventListener('click', () => {
                nextSlide();
                stopAutoplay();
                startAutoplay();
            });
            
            track.addEventListener('mouseenter', stopAutoplay);
            track.addEventListener('mouseleave', startAutoplay);
            
            window.addEventListener('resize', () => {
                updateSlidesToShow();
                createNavDots();
                goToSlide(0);
            });
            
            updateSlidesToShow();
            createNavDots();
            startAutoplay();
        })();

        function openModal(imageSrc) {
            const modal = document.getElementById('diplomaModal');
            const modalImage = document.getElementById('modalImage');
            modalImage.src = imageSrc;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeModal() {
            const modal = document.getElementById('diplomaModal');
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.diploma-card img').forEach(img => {
                img.parentElement.style.cursor = 'pointer';
                img.parentElement.addEventListener('click', function() {
                    openModal(img.src);
                });
            });
            
            document.getElementById('diplomaModal')?.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });
        });
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
/**
 * Applies translations to all elements with data-i18n-key attribute.
 * @param {string} lang - The language code (e.g., 'en', 'uk', 'pl').
 */
const setLanguage = (lang) => {
    localStorage.setItem('siteLang', lang);

    const elements = document.querySelectorAll('[data-i18n-key]');
    const currentTranslations = translations[lang] || translations[DEFAULT_LANG];

    elements.forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        if (currentTranslations[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = currentTranslations[key];
            } else {
                element.textContent = currentTranslations[key];
            }
        }
    });
};

const initializeForm = () => {
    const form = document.getElementById('bookingForm');
    const formMessage = document.getElementById('formMessage');
    if (form) {
        form.innerHTML = `
            <div class="space-y-4">
                <div>
                    <label for="parentName" class="block text-sm font-medium text-gray-700" data-i18n-key="form_name">Your Name</label>
                    <input type="text" id="parentName" name="parentName" required placeholder="" data-i18n-key="form_name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500">
                </div>
                <div>
                    <label for="contactPhone" class="block text-sm font-medium text-gray-700" data-i18n-key="form_phone">Contact Phone</label>
                    <input type="tel" id="contactPhone" name="contactPhone" required placeholder="" data-i18n-key="form_phone" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500">
                </div>
                <div>
                    <label for="problemDescription" class="block text-sm font-medium text-gray-700" data-i18n-key="form_challenge">Briefly describe the challenge</label>
                    <textarea id="problemDescription" name="problemDescription" rows="4" placeholder="" data-i18n-key="form_challenge" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"></textarea>
                </div>
                <button type="submit" id="submitButton" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 transition duration-150" data-i18n-key="form_send">
                    Send Application
                </button>
            </div>
        `;
        
        // Apply translations after creating form
        const savedLang = localStorage.getItem('siteLang') || DEFAULT_LANG;
        setLanguage(savedLang);
    }

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.innerHTML = '';
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const currentLang = localStorage.getItem('siteLang') || DEFAULT_LANG;
        const submitButton = document.getElementById('submitButton');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        
        const loadingText = {
            'en': 'Sending...',
            'uk': 'Надсилання...',
            'pl': 'Wysyłanie...'
        };
        submitButton.textContent = loadingText[currentLang] || 'Sending...';

        try {
            const response = await fetch('YOUR_FORM_SUBMISSION_ENDPOINT', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                formMessage.innerHTML = `
                    <div class="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md">
                        ${translations[currentLang]['form_success']}
                    </div>
                `;
                form.reset();
            } else {
                throw new Error('Form submission failed.');
            }
        } catch (error) {
            formMessage.innerHTML = `
                <div class="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
                    ${translations[currentLang]['form_error']}
                </div>
            `;
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText; 
            setLanguage(currentLang); 
        }
    });
};

/**
 * Updates the active state of language options
 * @param {string} lang - The selected language code
 */
const updateActiveLanguage = (lang) => {
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('siteLang') || DEFAULT_LANG;
    setLanguage(savedLang);
    
    updateActiveLanguage(savedLang);

    const globeButton = document.getElementById('globeButton');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    if (globeButton && languageDropdown) {
        globeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-switcher')) {
                languageDropdown.classList.remove('active');
            }
        });

        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedLang = option.getAttribute('data-lang');
                setLanguage(selectedLang);
                updateActiveLanguage(selectedLang);
                languageDropdown.classList.remove('active');
            });
        });
    }

    initializeForm();
});