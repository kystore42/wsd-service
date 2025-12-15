const DEFAULT_LANG = 'en';

let mobileMenuState = {
    isOpen: false,
    elements: null
};

document.addEventListener('DOMContentLoaded', function() {
    mobileMenuState.elements = {
        menuBtn: document.getElementById('menuBtn'),
        navMenu: document.getElementById('navMenu'),
        mobileOverlay: document.getElementById('mobileMenuOverlay'),
        mobileCloseBtn: document.getElementById('mobileCloseBtn'),
        menuIcon: document.getElementById('menuIcon')
    };
    
    const { menuBtn, navMenu, mobileOverlay, mobileCloseBtn, menuIcon } = mobileMenuState.elements;
    
    function openMobileMenu() {
        console.log('openMobileMenu called, isOpen:', mobileMenuState.isOpen);
        if (mobileMenuState.isOpen) {
            console.log('Menu already open, skipping');
            return;
        }
        
        mobileMenuState.isOpen = true;
        console.log('Opening menu, isOpen set to:', mobileMenuState.isOpen);
        
        navMenu.classList.remove('hidden');
        navMenu.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            navMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            menuIcon.textContent = '×';
        }, 10);
    }
    
    function closeMobileMenu() {
        console.log('closeMobileMenu called, isOpen:', mobileMenuState.isOpen);
        if (!mobileMenuState.isOpen) {
            console.log('Menu already closed, skipping');
            return;
        }
        
        mobileMenuState.isOpen = false;
        console.log('Closing menu, isOpen set to:', mobileMenuState.isOpen);
        
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        menuIcon.textContent = '☰';
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            if (window.innerWidth < 768) {
                navMenu.classList.add('hidden');
                navMenu.style.display = 'none';
            }
        }, 400);
    }
    
    window.closeMobileMenu = closeMobileMenu;
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (mobileMenuState.isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }
    
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
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
            
            setTimeout(() => {
                if (window.innerWidth < 768) {
                    closeMobileMenu();
                }
            }, 200);
        });
    });
    
    const currentLang = localStorage.getItem('siteLang') || 'en';
    document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
        if (btn.getAttribute('data-mobile-lang') === currentLang) {
            btn.classList.add('active');
        }
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            mobileMenuState.isOpen = false;
            navMenu.classList.remove('active', 'hidden');
            navMenu.classList.add('md:flex');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            menuIcon.textContent = '☰';
        } else {
            if (!mobileMenuState.isOpen) {
                navMenu.classList.add('hidden');
            }
        }
    });
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
        
        if (element.id === 'menuIcon') {
            return;
        }
        
        if (currentTranslations[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = currentTranslations[key];
            } else {
                element.textContent = currentTranslations[key];
            }
        }
    });
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && currentTranslations['meta_description']) {
        metaDescription.setAttribute('content', currentTranslations['meta_description']);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && currentTranslations['og_title']) {
        ogTitle.setAttribute('content', currentTranslations['og_title']);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && currentTranslations['og_description']) {
        ogDescription.setAttribute('content', currentTranslations['og_description']);
    }
    
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle && currentTranslations['twitter_title']) {
        twitterTitle.setAttribute('content', currentTranslations['twitter_title']);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription && currentTranslations['twitter_description']) {
        twitterDescription.setAttribute('content', currentTranslations['twitter_description']);
    }
    
    document.documentElement.lang = lang;
};

(function() {
            let lastScrollTop = 0;
            const header = document.querySelector('header');
            const scrollThreshold = 100;
            
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop < scrollThreshold) {
                    header.classList.remove('header-hidden');
                    return;
                } 
                if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                    header.classList.add('header-hidden');
                } 
                else if (scrollTop < lastScrollTop) {
                    header.classList.remove('header-hidden');
                }
                lastScrollTop = scrollTop;
            });
        })();

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
                    <input type="tel" id="contactPhone" name="contactPhone" required placeholder="+48" value="+48" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500">
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
        
        const savedLang = localStorage.getItem('siteLang') || DEFAULT_LANG;
        setLanguage(savedLang);
        
        const phoneInput = document.getElementById('contactPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value;
                
                if (!value.startsWith('+48')) {
                    value = '+48' + value.replace(/^\+48/, '');
                }
                
                value = '+48' + value.substring(3).replace(/\D/g, '');
                
                if (value.length > 12) {
                    value = value.substring(0, 12);
                }
                
                e.target.value = value;
            });
            
            phoneInput.addEventListener('keydown', function(e) {
                const cursorPosition = e.target.selectionStart;
                
                if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= 3) {
                    e.preventDefault();
                }
            });
            
            phoneInput.addEventListener('focus', function(e) {
                if (e.target.value === '+48') {
                    setTimeout(() => {
                        e.target.setSelectionRange(3, 3);
                    }, 0);
                }
            });
        }
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
            const templateParams = {
                from_name: data.parentName,
                from_phone: data.contactPhone,
                message: data.problemDescription
            };

            const response = await emailjs.send(
                'service_gmbqx2r',
                'template_g00uujb',
                templateParams,
                'JZfCCt7hVHjixlTfb'
            );

            if (response.status === 200) {
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
            console.error('EmailJS Error:', error);
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

const initializeFAQ = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
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
    
    initializeFAQ();

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
    
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    const floatingBtn = document.getElementById('floatingBookBtn');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const telegramBtn = document.getElementById('telegramBtn');
    
    if (floatingBtn) {
        let lastScrollTop = 0;
        const showAfterScroll = 250; 
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > showAfterScroll) {
                floatingBtn.classList.add('visible');
                if (whatsappBtn) {
                    whatsappBtn.style.opacity = '1';
                    whatsappBtn.style.transform = 'translateY(0)';
                    whatsappBtn.style.pointerEvents = 'all';
                }
                if (telegramBtn) {
                    telegramBtn.style.opacity = '1';
                    telegramBtn.style.transform = 'translateY(0)';
                    telegramBtn.style.pointerEvents = 'all';
                }
            } else {
                floatingBtn.classList.remove('visible');
                if (whatsappBtn) {
                    whatsappBtn.style.opacity = '0';
                    whatsappBtn.style.transform = 'translateY(100px)';
                    whatsappBtn.style.pointerEvents = 'none';
                }
                if (telegramBtn) {
                    telegramBtn.style.opacity = '0';
                    telegramBtn.style.transform = 'translateY(100px)';
                    telegramBtn.style.pointerEvents = 'none';
                }
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');
    
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    if (!cookieChoice) {
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 1000);
    }
    
    cookieAccept.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieConsent.classList.remove('show');
        
        console.log('Cookies accepted - Initialize analytics');
    });
    
    cookieDecline.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'declined');
        cookieConsent.classList.remove('show');
        
        console.log('Cookies declined - Only essential cookies');
    });
    
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    });
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; 
        const increment = target / (duration / 16); 
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
    
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('hidden');
            }
        }, 500);
    });
    
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const particles = [];
        const particleCount = 50;
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            
            draw() {
                ctx.fillStyle = `rgba(234, 88, 12, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
        
        window.addEventListener('resize', () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });
    }
    
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < window.innerHeight) {
                const heroContent = heroSection.querySelector('.container');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                }
            }
        });
    }
});
