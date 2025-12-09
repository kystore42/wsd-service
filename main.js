const DEFAULT_LANG = 'en';

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
                    <input type="text" id="parentName" name="parentName" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500">
                </div>
                <div>
                    <label for="contactPhone" class="block text-sm font-medium text-gray-700" data-i18n-key="form_phone">Contact Phone</label>
                    <input type="tel" id="contactPhone" name="contactPhone" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500">
                </div>
                <div>
                    <label for="problemDescription" class="block text-sm font-medium text-gray-700" data-i18n-key="form_challenge">Briefly describe the challenge</label>
                    <textarea id="problemDescription" name="problemDescription" rows="4" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"></textarea>
                </div>
                <button type="submit" id="submitButton" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 transition duration-150" data-i18n-key="form_send">
                    Send Application
                </button>
            </div>
        `;
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