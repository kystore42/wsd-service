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
        
        window.testimonialsCarousel = null;
        
        function initTestimonialsCarousel() {
            if (window.testimonialsCarousel && window.testimonialsCarousel.destroy) {
                window.testimonialsCarousel.destroy();
            }
            
            const track = document.getElementById('testimonialsTrack');
            const prevBtn = document.getElementById('testimonialsCarouselPrev');
            const nextBtn = document.getElementById('testimonialsCarouselNext');
            const navContainer = document.getElementById('testimonialsCarouselNav');
            
            if (!track || !navContainer) {
                console.log('Testimonials carousel: missing elements');
                return;
            }
            
            let currentIndex = 0;
            let slidesToShow = 1;
            let autoplayInterval;
            let prevSlideHandler, nextSlideHandler, resizeHandler;
            
            function getSlides() {
                return document.querySelectorAll('.testimonial-slide:not(.is-hidden)');
            }
            
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
                if (!navContainer) return;
                const slides = getSlides();
                if (!slides.length) return;
                
                navContainer.innerHTML = '';
                
                const totalPages = slides.length <= slidesToShow ? 1 : Math.ceil(slides.length / slidesToShow);
                
                for (let i = 0; i < totalPages; i++) {
                    const dot = document.createElement('button');
                    dot.setAttribute('aria-label', `Go to page ${i + 1}`);
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => goToSlide(i * slidesToShow));
                    navContainer.appendChild(dot);
                }
            }
            
            function updateNavDots() {
                if (!navContainer) return;
                const dots = navContainer.querySelectorAll('button');
                if (!dots.length) return;
                
                const slides = getSlides();
                if (!slides.length) return;
                
                const totalPages = slides.length <= slidesToShow ? 1 : Math.ceil(slides.length / slidesToShow);
                const currentPage = Math.min(Math.floor(currentIndex / slidesToShow), totalPages - 1);
                
                dots.forEach((dot, index) => {
                    if (index === currentPage) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
            
            function goToSlide(index) {
                const slides = getSlides();
                if (!slides.length) {
                    track.style.transform = 'translateX(0%)';
                    updateNavDots();
                    return;
                }
                
                if (slides.length <= slidesToShow) {
                    currentIndex = 0;
                    track.style.transform = 'translateX(0%)';
                    updateNavDots();
                    return;
                }
                
                const maxIndex = slides.length - slidesToShow;
                currentIndex = Math.max(0, Math.min(index, maxIndex));
                const offset = -(currentIndex * (100 / slidesToShow));
                track.style.transform = `translateX(${offset}%)`;
                updateNavDots();
            }
            
            function nextSlide() {
                const slides = getSlides();
                if (!slides.length) return;
                
                if (slides.length <= slidesToShow) {
                    return;
                }
                
                const totalPages = Math.ceil(slides.length / slidesToShow);
                const currentPage = Math.floor(currentIndex / slidesToShow);
                const nextPage = (currentPage + 1) % totalPages;
                currentIndex = nextPage * slidesToShow;
                goToSlide(currentIndex);
            }
            
            function prevSlide() {
                const slides = getSlides();
                if (!slides.length) return;
                
                if (slides.length <= slidesToShow) {
                    return;
                }
                
                const totalPages = Math.ceil(slides.length / slidesToShow);
                const currentPage = Math.floor(currentIndex / slidesToShow);
                const prevPage = currentPage === 0 ? totalPages - 1 : currentPage - 1;
                currentIndex = prevPage * slidesToShow;
                goToSlide(currentIndex);
            }
            
            function startAutoplay() {
                stopAutoplay();
                const slides = getSlides();
                if (slides.length <= slidesToShow) {
                    return;
                }
                autoplayInterval = setInterval(nextSlide, 5000);
            }
            
            function stopAutoplay() {
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                    autoplayInterval = null;
                }
            }
            
            function updateArrowsVisibility() {
                const slides = getSlides();
                const shouldHideArrows = slides.length <= slidesToShow;
                
                if (prevBtn) {
                    prevBtn.style.display = shouldHideArrows ? 'none' : 'flex';
                }
                if (nextBtn) {
                    nextBtn.style.display = shouldHideArrows ? 'none' : 'flex';
                }
            }
            
            function destroy() {
                stopAutoplay();
                if (prevBtn && prevSlideHandler) {
                    prevBtn.removeEventListener('click', prevSlideHandler);
                }
                if (nextBtn && nextSlideHandler) {
                    nextBtn.removeEventListener('click', nextSlideHandler);
                }
                if (track) {
                    track.removeEventListener('mouseenter', stopAutoplay);
                    track.removeEventListener('mouseleave', startAutoplay);
                }
                if (resizeHandler) {
                    window.removeEventListener('resize', resizeHandler);
                }
            }
            
            prevSlideHandler = () => {
                prevSlide();
                stopAutoplay();
                startAutoplay();
            };
            
            nextSlideHandler = () => {
                nextSlide();
                stopAutoplay();
                startAutoplay();
            };
            
            resizeHandler = () => {
                const oldSlidesToShow = slidesToShow;
                updateSlidesToShow();
                if (oldSlidesToShow !== slidesToShow) {
                    createNavDots();
                    updateArrowsVisibility();
                    currentIndex = 0;
                    goToSlide(0);
                    startAutoplay();
                }
            };
            
            if (prevBtn) prevBtn.addEventListener('click', prevSlideHandler);
            if (nextBtn) nextBtn.addEventListener('click', nextSlideHandler);
            track.addEventListener('mouseenter', stopAutoplay);
            track.addEventListener('mouseleave', startAutoplay);
            window.addEventListener('resize', resizeHandler);
            
            updateSlidesToShow();
            createNavDots();
            updateArrowsVisibility();
            currentIndex = 0;
            goToSlide(0);
            startAutoplay();
            
            window.testimonialsCarousel = {
                destroy,
                refresh: () => {
                    currentIndex = 0;
                    createNavDots();
                    updateArrowsVisibility();
                    goToSlide(0);
                }
            };
            
            console.log('Testimonials carousel initialized with', getSlides().length, 'slides, showing', slidesToShow, 'at a time');
        }
        
        initTestimonialsCarousel();

        function initTestimonialsFilters() {
            const filterButtons = document.querySelectorAll('.testimonial-filter');
            const slides = document.querySelectorAll('.testimonial-slide');
            if (!filterButtons.length || !slides.length) return;

            const applyFilter = (filter) => {
                slides.forEach(slide => {
                    const tags = (slide.getAttribute('data-tags') || '')
                        .split(',')
                        .map(tag => tag.trim())
                        .filter(Boolean);
                    const isMatch = filter === 'all' || tags.includes(filter);
                    slide.classList.toggle('is-hidden', !isMatch);
                });
                initTestimonialsCarousel();
            };

            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    applyFilter(button.getAttribute('data-filter'));
                });
            });
        }

        initTestimonialsFilters();
        
        window.reinitTestimonialsCarousel = initTestimonialsCarousel;

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
 * @param {string} lang .
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
    
    // Update call hours label when language changes
    if (window.adminManager && window.adminManager.updatePageContacts) {
        window.adminManager.updatePageContacts();
    }
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
                <div class="form-step-indicator">
                    <span class="form-step-label active" data-step="1" data-i18n-key="form_step_1">Step 1 of 2</span>
                    <span class="form-step-label" data-step="2" data-i18n-key="form_step_2">Step 2 of 2</span>
                </div>
                <div id="formStepError" class="form-step-error" aria-live="polite"></div>
                <div class="form-step form-step-1 active">
                    <div>
                        <label for="parentName" class="block text-sm font-medium text-gray-700" data-i18n-key="form_name">Your Name</label>
                        <input type="text" id="parentName" name="parentName" required placeholder="" data-i18n-key="form_name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500">
                    </div>
                    <div>
                        <label for="contactPhone" class="block text-sm font-medium text-gray-700" data-i18n-key="form_phone">Contact Phone</label>
                        <input type="tel" id="contactPhone" name="contactPhone" required placeholder="+48" value="+48" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500">
                    </div>
                    <button type="button" id="nextStepBtn" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 transition duration-150" data-i18n-key="form_next">
                        Next
                    </button>
                </div>
                <div class="form-step form-step-2">
                    <div>
                        <label for="problemDescription" class="block text-sm font-medium text-gray-700" data-i18n-key="form_challenge">Briefly describe the challenge</label>
                        <textarea id="problemDescription" name="problemDescription" rows="4" placeholder="" data-i18n-key="form_challenge" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"></textarea>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button type="button" id="backStepBtn" class="w-full flex justify-center py-3 px-4 border border-orange-600 rounded-md shadow-sm text-lg font-medium text-orange-700 bg-white hover:bg-orange-50 transition duration-150" data-i18n-key="form_back">
                            Back
                        </button>
                        <button type="submit" id="submitButton" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 transition duration-150" data-i18n-key="form_send">
                            Send Application
                        </button>
                    </div>
                </div>
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

        const nextStepBtn = document.getElementById('nextStepBtn');
        const backStepBtn = document.getElementById('backStepBtn');
        const step1 = form.querySelector('.form-step-1');
        const step2 = form.querySelector('.form-step-2');
        const stepLabels = form.querySelectorAll('.form-step-label');
        const stepError = document.getElementById('formStepError');

        const setStep = (step) => {
            step1.classList.toggle('active', step === 1);
            step2.classList.toggle('active', step === 2);
            stepLabels.forEach(label => {
                label.classList.toggle('active', parseInt(label.getAttribute('data-step'), 10) === step);
            });
            if (stepError) {
                stepError.textContent = '';
                stepError.classList.remove('visible');
            }
        };

        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => {
                const nameValue = document.getElementById('parentName')?.value.trim();
                const phoneValue = document.getElementById('contactPhone')?.value.trim();
                const currentLang = localStorage.getItem('siteLang') || DEFAULT_LANG;
                if (!nameValue || !phoneValue || phoneValue === '+48') {
                    if (stepError) {
                        stepError.textContent = translations[currentLang]['form_step_error'] || 'Please fill in required fields.';
                        stepError.classList.add('visible');
                    }
                    return;
                }
                setStep(2);
            });
        }

        if (backStepBtn) {
            backStepBtn.addEventListener('click', () => {
                setStep(1);
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
 * @param {string} lang 
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

    const reduceHeroMotion = true;
    
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    const floatingActions = document.getElementById('floatingActions');
    const floatingToggle = document.getElementById('floatingToggle');
    const floatingMenu = document.getElementById('floatingActionsMenu');

    if (floatingActions && floatingToggle && floatingMenu) {
        const showAfterScroll = 250;

        const closeFloatingMenu = () => {
            floatingActions.classList.remove('open');
            floatingToggle.setAttribute('aria-expanded', 'false');
        };

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > showAfterScroll) {
                floatingActions.classList.add('visible');
            } else {
                floatingActions.classList.remove('visible');
                closeFloatingMenu();
            }
        });

        floatingToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = floatingActions.classList.toggle('open');
            floatingToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        floatingMenu.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                closeFloatingMenu();
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#floatingActions')) {
                closeFloatingMenu();
            }
        });

        const footer = document.querySelector('footer');
        if (footer && 'IntersectionObserver' in window) {
            const footerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        floatingActions.classList.add('is-hidden');
                        closeFloatingMenu();
                    } else {
                        floatingActions.classList.remove('is-hidden');
                    }
                });
            }, {
                rootMargin: '0px 0px -20% 0px'
            });
            footerObserver.observe(footer);
        }
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
    if (canvas && !reduceHeroMotion) {
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
    } else if (canvas) {
        canvas.style.display = 'none';
    }
    
    const heroSection = document.getElementById('hero');
    if (heroSection && !reduceHeroMotion) {
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