const DEFAULT_LANG = 'en';
const ADMIN_PASSWORD = 'eratosfen';
const STORAGE_KEY = 'adminDataV2';
const DATA_URL = 'admin-data.json';

let adminData = { testimonials: [], gallery: [] };
let currentLang = DEFAULT_LANG;
let currentEdit = { type: null, index: null };

const langOrder = ['en', 'uk', 'pl'];

const toggleLabels = {
    en: { more: 'Read more', less: 'Show less' },
    uk: { more: 'Докладніше', less: 'Згорнути' },
    pl: { more: 'Czytaj więcej', less: 'Zwinąć' }
};

const getToggleLabel = (expanded) => {
    const labels = toggleLabels[currentLang] || toggleLabels[DEFAULT_LANG];
    return expanded ? labels.less : labels.more;
};

const getLocalized = (value, lang) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value[DEFAULT_LANG] || '';
};

const setLanguage = (lang) => {
    const current = translations[lang] || translations[DEFAULT_LANG];
    document.querySelectorAll('[data-i18n-key]').forEach((el) => {
        const key = el.getAttribute('data-i18n-key');
        const value = current[key];
        if (!value) {
            return;
        }
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = value;
        } else if (el.tagName === 'META') {
            el.setAttribute('content', value);
        } else if (el.tagName === 'TITLE') {
            document.title = value;
        } else {
            el.textContent = value;
        }
    });
    document.documentElement.lang = lang;
    localStorage.setItem('siteLang', lang);
    currentLang = lang;
    renderTestimonials();
    renderGallery();
};

const updateActiveLanguage = (lang) => {
    document.querySelectorAll('.language-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('.language-option').forEach((option) => {
        option.classList.toggle('active', option.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('.mobile-lang-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-mobile-lang') === lang);
    });
};

const loadData = async () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            adminData = JSON.parse(saved);
            return;
        } catch (error) {
            console.warn('Failed to parse admin data from localStorage.', error);
        }
    }

    try {
        const response = await fetch(DATA_URL);
        const data = await response.json();
        adminData = data;
    } catch (error) {
        console.warn('Failed to load admin-data.json, using empty data.', error);
        adminData = { testimonials: [], gallery: [] };
    }
};

const saveData = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData));
        return true;
    } catch (error) {
        console.warn('Failed to save admin data to localStorage.', error);
        const errorLabels = {
            en: 'Save failed. File may be too large for browser storage. Try a smaller file or use external link.',
            uk: 'Помилка збереження. Файл може бути занадто великим для браузерного сховища. Спробуйте менший файл або використовуйте зовнішнє посилання.',
            pl: 'Zapis nie powiódł się. Plik może być zbyt duży dla pamięci przeglądarki. Spróbuj mniejszego pliku lub użyj linku zewnętrznego.'
        };
        alert(errorLabels[currentLang] || errorLabels.en);
        return false;
    }
};

const downloadData = () => {
    const blob = new Blob([JSON.stringify(adminData, null, 4)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin-data.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

const renderTestimonials = () => {
    const list = document.getElementById('reviewsList');
    if (!list) return;

    list.innerHTML = '';
    if (!adminData.testimonials || adminData.testimonials.length === 0) {
        list.innerHTML = '<p class="text-sm text-gray-500">No testimonials yet.</p>';
        return;
    }

    adminData.testimonials.forEach((item) => {
        const name = getLocalized(item.name, currentLang);
        const role = getLocalized(item.role, currentLang);
        const text = getLocalized(item.text, currentLang);

        const card = document.createElement('div');
        card.className = 'review-card bg-white rounded-2xl shadow-lg border border-orange-100';

        let mediaHtml = '';
        if (item.photo && item.photo.src) {
            mediaHtml += `<img src="${item.photo.src}" alt="${name}" class="w-full h-40 object-cover rounded-xl mt-4" loading="lazy">`;
        }
        if (item.video && item.video.src) {
            if (item.video.isFile || item.video.src.startsWith('data:')) {
                mediaHtml += `<video controls class="w-full rounded-xl mt-4" src="${item.video.src}"></video>`;
            } else {
                mediaHtml += `<a class="inline-flex items-center gap-2 text-orange-700 font-semibold mt-4" href="${item.video.src}" target="_blank">Watch video</a>`;
            }
        }

        const shouldToggle = text.length > 140;

        card.innerHTML = `
            <div class="review-header">
                <div class="review-icon" aria-hidden="true">
                    <i class="fas fa-user"></i>
                </div>
                <div>
                    <p class="review-name">${name}</p>
                    <p class="review-role">${role}</p>
                </div>
            </div>
            <p class="review-text${shouldToggle ? '' : ' is-short'}">${text}</p>
            ${shouldToggle ? `<button class="review-toggle" type="button" aria-expanded="false">${getToggleLabel(false)}</button>` : ''}
            ${mediaHtml}
        `;
        list.appendChild(card);
    });
};

const renderGallery = () => {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    grid.innerHTML = '';
    if (!adminData.gallery || adminData.gallery.length === 0) {
        grid.innerHTML = '<p class="text-sm text-gray-500">No gallery items yet.</p>';
        return;
    }

    adminData.gallery.forEach((item) => {
        const title = getLocalized(item.title, currentLang);
        const caption = getLocalized(item.caption, currentLang);

        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl shadow-lg border border-orange-100 p-5';

        let mediaHtml = '';
        if (item.type === 'photo' && item.src) {
            mediaHtml = `<img src="${item.src}" alt="${title}" class="w-full h-48 object-cover rounded-xl" loading="lazy">`;
        } else if (item.type === 'video' && item.src) {
            if (item.isFile || item.src.startsWith('data:')) {
                mediaHtml = `<video controls class="w-full rounded-xl" src="${item.src}"></video>`;
            } else {
                mediaHtml = `<a class="inline-flex items-center gap-2 text-orange-700 font-semibold" href="${item.src}" target="_blank">Open video</a>`;
            }
        }

        card.innerHTML = `
            ${mediaHtml}
            <h3 class="text-lg font-bold text-orange-700 mt-3">${title}</h3>
            <p class="text-sm text-gray-600">${caption}</p>
        `;
        grid.appendChild(card);
    });
};

const isAdminMode = () => new URL(window.location).searchParams.get('admin') === 'true';

const openAdmin = () => {
    const panel = document.getElementById('adminPanel');
    if (panel) panel.classList.add('active');
};

const closeAdmin = () => {
    window.location.href = window.location.href.split('?')[0];
};

const toggleAdminMode = () => {
    const passwordModal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('passwordInput');
    const passwordSubmit = document.getElementById('passwordSubmitBtn');

    passwordModal.style.display = 'flex';
    passwordInput.value = '';
    passwordInput.focus();

    const handleSubmit = () => {
        if (passwordInput.value === ADMIN_PASSWORD) {
            window.location.href = window.location.href.split('?')[0] + '?admin=true';
        } else {
            passwordInput.classList.add('error-shake');
            setTimeout(() => passwordInput.classList.remove('error-shake'), 500);
        }
    };

    passwordSubmit.onclick = handleSubmit;
    document.getElementById('passwordCancelBtn').onclick = () => {
        passwordModal.style.display = 'none';
    };
    document.getElementById('passwordModalClose').onclick = () => {
        passwordModal.style.display = 'none';
    };
};

const getModalValue = (id) => document.getElementById(id).value.trim();

const setModalValue = (id, value) => {
    document.getElementById(id).value = value || '';
};

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    if (!file) {
        resolve(null);
        return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
});

const autoFillLanguages = (sourceLang, fields, isText) => {
    langOrder.forEach((lang) => {
        if (lang === sourceLang) return;
        const source = fields[sourceLang] || '';
        if (!source) return;
        fields[lang] = isText ? `[TODO] ${source}` : source;
    });
};

const openTestimonialModal = (index = null) => {
    currentEdit = { type: 'testimonial', index };
    document.getElementById('testimonialModal').style.display = 'flex';
    const labels = {
        en: { add: 'Add Review', edit: 'Edit Review' },
        uk: { add: 'Додати відгук', edit: 'Редагувати відгук' },
        pl: { add: 'Dodaj opinię', edit: 'Edytuj opinię' }
    };
    const label = labels[currentLang] || labels.en;
    document.getElementById('testimonialModalTitle').textContent = index === null ? label.add : label.edit;

    const item = index === null ? null : adminData.testimonials[index];
    setModalValue('testimonialNameEn', item ? item.name.en : '');
    setModalValue('testimonialNameUk', item ? item.name.uk : '');
    setModalValue('testimonialNamePl', item ? item.name.pl : '');
    setModalValue('testimonialRoleEn', item ? item.role.en : '');
    setModalValue('testimonialRoleUk', item ? item.role.uk : '');
    setModalValue('testimonialRolePl', item ? item.role.pl : '');
    setModalValue('testimonialTextEn', item ? item.text.en : '');
    setModalValue('testimonialTextUk', item ? item.text.uk : '');
    setModalValue('testimonialTextPl', item ? item.text.pl : '');
    setModalValue('testimonialTags', item ? (item.tags || []).join(', ') : '');
    setModalValue('testimonialVideoUrl', item && item.video && !item.video.isFile ? item.video.src : '');

    document.getElementById('testimonialPhotoFile').value = '';
    document.getElementById('testimonialVideoFile').value = '';
};

const closeTestimonialModal = () => {
    document.getElementById('testimonialModal').style.display = 'none';
};

const saveTestimonialModal = async () => {
    const name = {
        en: getModalValue('testimonialNameEn'),
        uk: getModalValue('testimonialNameUk'),
        pl: getModalValue('testimonialNamePl')
    };
    const role = {
        en: getModalValue('testimonialRoleEn'),
        uk: getModalValue('testimonialRoleUk'),
        pl: getModalValue('testimonialRolePl')
    };
    const text = {
        en: getModalValue('testimonialTextEn'),
        uk: getModalValue('testimonialTextUk'),
        pl: getModalValue('testimonialTextPl')
    };

    if (!name.en || !text.en) {
        const errorLabels = {
            en: 'Please add at least name and text in English.',
            uk: 'Будь ласка, додайте щонайменше ім\'я та текст англійською.',
            pl: 'Proszę dodaj przynajmniej imię i tekst w języku angielskim.'
        };
        alert(errorLabels[currentLang] || errorLabels.en);
        return;
    }

    const tags = getModalValue('testimonialTags')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

    const photoFile = document.getElementById('testimonialPhotoFile').files[0];
    const videoFile = document.getElementById('testimonialVideoFile').files[0];
    const videoUrl = getModalValue('testimonialVideoUrl');

    let photoData = null;
    let videoData = null;
    try {
        photoData = await readFileAsDataUrl(photoFile);
        videoData = await readFileAsDataUrl(videoFile);
    } catch (error) {
        console.warn('Failed to read testimonial media.', error);
        const errorLabels = {
            en: 'Failed to read file. Try another file.',
            uk: 'Помилка при читанні файлу. Спробуйте інший файл.',
            pl: 'Nie udało się przочytać pliku. Spróbuj inny plik.'
        };
        alert(errorLabels[currentLang] || errorLabels.en);
        return;
    }

    const record = {
        id: currentEdit.index === null ? `t-${Date.now()}` : adminData.testimonials[currentEdit.index].id,
        name,
        role,
        text,
        tags,
        photo: photoData ? { src: photoData, name: photoFile.name } : (currentEdit.index === null ? null : adminData.testimonials[currentEdit.index].photo),
        video: null,
        createdAt: currentEdit.index === null ? new Date().toISOString().slice(0, 10) : adminData.testimonials[currentEdit.index].createdAt
    };

    if (videoData) {
        record.video = { src: videoData, name: videoFile.name, isFile: true };
    } else if (videoUrl) {
        record.video = { src: videoUrl, isFile: false };
    } else if (currentEdit.index !== null) {
        record.video = adminData.testimonials[currentEdit.index].video || null;
    }

    if (currentEdit.index === null) {
        adminData.testimonials.unshift(record);
    } else {
        adminData.testimonials[currentEdit.index] = record;
    }

    saveData();
    renderTestimonials();
    renderAdminLists();
    closeTestimonialModal();
};

const openGalleryModal = (index = null) => {
    currentEdit = { type: 'gallery', index };
    document.getElementById('galleryModal').style.display = 'flex';
    const labels = {
        en: { add: 'Add Gallery Item', edit: 'Edit Gallery Item' },
        uk: { add: 'Додати елемент галереї', edit: 'Редагувати елемент галереї' },
        pl: { add: 'Dodaj element galerii', edit: 'Edytuj element galerii' }
    };
    const label = labels[currentLang] || labels.en;
    document.getElementById('galleryModalTitle').textContent = index === null ? label.add : label.edit;

    const item = index === null ? null : adminData.gallery[index];
    setModalValue('galleryTitleEn', item ? item.title.en : '');
    setModalValue('galleryTitleUk', item ? item.title.uk : '');
    setModalValue('galleryTitlePl', item ? item.title.pl : '');
    setModalValue('galleryCaptionEn', item ? item.caption.en : '');
    setModalValue('galleryCaptionUk', item ? item.caption.uk : '');
    setModalValue('galleryCaptionPl', item ? item.caption.pl : '');
    document.getElementById('galleryType').value = item ? item.type : 'photo';
    setModalValue('galleryVideoUrl', item && item.type === 'video' && !item.isFile ? item.src : '');

    document.getElementById('galleryMediaFile').value = '';
};

const closeGalleryModal = () => {
    document.getElementById('galleryModal').style.display = 'none';
};

const saveGalleryModal = async () => {
    const title = {
        en: getModalValue('galleryTitleEn'),
        uk: getModalValue('galleryTitleUk'),
        pl: getModalValue('galleryTitlePl')
    };
    const caption = {
        en: getModalValue('galleryCaptionEn'),
        uk: getModalValue('galleryCaptionUk'),
        pl: getModalValue('galleryCaptionPl')
    };

    if (!title.en) {
        const errorLabels = {
            en: 'Please add at least title in English.',
            uk: 'Будь ласка, додайте щонайменше заголовок англійською.',
            pl: 'Proszę dodaj przynajmniej tytuł w języku angielskim.'
        };
        alert(errorLabels[currentLang] || errorLabels.en);
        return;
    }

    const type = document.getElementById('galleryType').value;
    const mediaFile = document.getElementById('galleryMediaFile').files[0];
    const videoUrl = getModalValue('galleryVideoUrl');

    let mediaData = null;
    try {
        mediaData = await readFileAsDataUrl(mediaFile);
    } catch (error) {
        console.warn('Failed to read gallery media.', error);
        const errorLabels = {
            en: 'Failed to read file. Try another file.',
            uk: 'Помилка при читанні файлу. Спробуйте інший файл.',
            pl: 'Nie udało się przoczytać pliku. Spróbuj inny plik.'
        };
        alert(errorLabels[currentLang] || errorLabels.en);
        return;
    }

    const record = {
        id: currentEdit.index === null ? `g-${Date.now()}` : adminData.gallery[currentEdit.index].id,
        title,
        caption,
        type,
        src: null,
        isFile: false,
        createdAt: currentEdit.index === null ? new Date().toISOString().slice(0, 10) : adminData.gallery[currentEdit.index].createdAt
    };

    if (mediaData) {
        record.src = mediaData;
        record.isFile = true;
    } else if (type === 'video' && videoUrl) {
        record.src = videoUrl;
    } else if (currentEdit.index !== null) {
        record.src = adminData.gallery[currentEdit.index].src;
        record.isFile = adminData.gallery[currentEdit.index].isFile;
    }

    if (currentEdit.index === null) {
        adminData.gallery.unshift(record);
    } else {
        adminData.gallery[currentEdit.index] = record;
    }

    saveData();
    renderGallery();
    renderAdminLists();
    closeGalleryModal();
};

const deleteItem = (type, index) => {
    if (!confirm('Удалить этот элемент?')) return;
    if (type === 'testimonial') {
        adminData.testimonials.splice(index, 1);
    } else {
        adminData.gallery.splice(index, 1);
    }
    saveData();
    renderTestimonials();
    renderGallery();
    renderAdminLists();
};

const renderAdminLists = () => {
    const testimonialList = document.getElementById('adminTestimonialList');
    const galleryList = document.getElementById('adminGalleryList');

    if (testimonialList) {
        testimonialList.innerHTML = '';
        if (!adminData.testimonials || adminData.testimonials.length === 0) {
            testimonialList.innerHTML = '<p style="color: #999; font-size: 14px;">Отзывов пока нет.</p>';
        } else {
            adminData.testimonials.forEach((item, index) => {
                const name = getLocalized(item.name, currentLang);
                const text = getLocalized(item.text, currentLang);
                const entry = document.createElement('div');
                entry.className = 'admin-testimonial-item';
                entry.innerHTML = `
                    <h4>${name}</h4>
                    <div class="admin-testimonial-item-text">${text}</div>
                    <div class="admin-testimonial-actions">
                        <button class="admin-btn-small admin-btn-edit" data-action="edit" data-index="${index}" data-type="testimonial">Редактировать</button>
                        <button class="admin-btn-small admin-btn-delete" data-action="delete" data-index="${index}" data-type="testimonial">Удалить</button>
                    </div>
                `;
                testimonialList.appendChild(entry);
            });
        }
    }

    if (galleryList) {
        galleryList.innerHTML = '';
        if (!adminData.gallery || adminData.gallery.length === 0) {
            galleryList.innerHTML = '<p style="color: #999; font-size: 14px;">Элементов галереи пока нет.</p>';
        } else {
            adminData.gallery.forEach((item, index) => {
                const title = getLocalized(item.title, currentLang);
                const entry = document.createElement('div');
                entry.className = 'admin-testimonial-item';
                entry.innerHTML = `
                    <h4>${title}</h4>
                    <div class="admin-testimonial-item-text">${item.type}</div>
                    <div class="admin-testimonial-actions">
                        <button class="admin-btn-small admin-btn-edit" data-action="edit" data-index="${index}" data-type="gallery">Редактировать</button>
                        <button class="admin-btn-small admin-btn-delete" data-action="delete" data-index="${index}" data-type="gallery">Удалить</button>
                    </div>
                `;
                galleryList.appendChild(entry);
            });
        }
    }
};

const applyAutoFillTestimonials = () => {
    const sourceLang = document.getElementById('testimonialSourceLang').value;
    const nameFields = {
        en: getModalValue('testimonialNameEn'),
        uk: getModalValue('testimonialNameUk'),
        pl: getModalValue('testimonialNamePl')
    };
    const roleFields = {
        en: getModalValue('testimonialRoleEn'),
        uk: getModalValue('testimonialRoleUk'),
        pl: getModalValue('testimonialRolePl')
    };
    const textFields = {
        en: getModalValue('testimonialTextEn'),
        uk: getModalValue('testimonialTextUk'),
        pl: getModalValue('testimonialTextPl')
    };

    autoFillLanguages(sourceLang, nameFields, false);
    autoFillLanguages(sourceLang, roleFields, false);
    autoFillLanguages(sourceLang, textFields, true);

    setModalValue('testimonialNameEn', nameFields.en);
    setModalValue('testimonialNameUk', nameFields.uk);
    setModalValue('testimonialNamePl', nameFields.pl);
    setModalValue('testimonialRoleEn', roleFields.en);
    setModalValue('testimonialRoleUk', roleFields.uk);
    setModalValue('testimonialRolePl', roleFields.pl);
    setModalValue('testimonialTextEn', textFields.en);
    setModalValue('testimonialTextUk', textFields.uk);
    setModalValue('testimonialTextPl', textFields.pl);
};

const applyAutoFillGallery = () => {
    const sourceLang = document.getElementById('gallerySourceLang').value;
    const titleFields = {
        en: getModalValue('galleryTitleEn'),
        uk: getModalValue('galleryTitleUk'),
        pl: getModalValue('galleryTitlePl')
    };
    const captionFields = {
        en: getModalValue('galleryCaptionEn'),
        uk: getModalValue('galleryCaptionUk'),
        pl: getModalValue('galleryCaptionPl')
    };

    autoFillLanguages(sourceLang, titleFields, false);
    autoFillLanguages(sourceLang, captionFields, true);

    setModalValue('galleryTitleEn', titleFields.en);
    setModalValue('galleryTitleUk', titleFields.uk);
    setModalValue('galleryTitlePl', titleFields.pl);
    setModalValue('galleryCaptionEn', captionFields.en);
    setModalValue('galleryCaptionUk', captionFields.uk);
    setModalValue('galleryCaptionPl', captionFields.pl);
};

const setupAdminEvents = () => {
    document.getElementById('adminCloseBtn').addEventListener('click', closeAdmin);
    document.getElementById('adminSaveBtn').addEventListener('click', () => {
        saveData();
        const successLabels = {
            en: 'Changes saved to browser storage. Use "Download" to update the file.',
            uk: 'Зміни збережені в браузерному сховищі. Використовуйте "Завантажити", щоб оновити файл.',
            pl: 'Zmiany zapisane w pamięci przeglądarki. Użyj "Pobierz", aby zaktualizować plik.'
        };
        alert(successLabels[currentLang] || successLabels.en);
    });
    document.getElementById('adminResetBtn').addEventListener('click', () => {
        if (!confirm('Сбросить к данным из файла по умолчанию?')) return;
        localStorage.removeItem(STORAGE_KEY);
        loadData().then(() => {
            renderTestimonials();
            renderGallery();
            renderAdminLists();
        });
    });
    document.getElementById('adminDownloadBtn').addEventListener('click', downloadData);

    document.getElementById('addTestimonialBtn').addEventListener('click', () => openTestimonialModal());
    document.getElementById('addGalleryBtn').addEventListener('click', () => openGalleryModal());

    document.getElementById('testimonialModalSave').addEventListener('click', saveTestimonialModal);
    document.getElementById('testimonialModalCancel').addEventListener('click', closeTestimonialModal);
    document.getElementById('testimonialModalClose').addEventListener('click', closeTestimonialModal);

    document.getElementById('galleryModalSave').addEventListener('click', saveGalleryModal);
    document.getElementById('galleryModalCancel').addEventListener('click', closeGalleryModal);
    document.getElementById('galleryModalClose').addEventListener('click', closeGalleryModal);

    document.getElementById('testimonialAutoFillBtn').addEventListener('click', applyAutoFillTestimonials);
    document.getElementById('galleryAutoFillBtn').addEventListener('click', applyAutoFillGallery);

    document.querySelectorAll('.admin-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab-content').forEach((content) => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            document.querySelectorAll('.admin-tab').forEach((btn) => btn.classList.remove('active'));

            const content = document.getElementById(`${tab.dataset.tab}-content`);
            content.classList.add('active');
            content.style.display = 'block';
            tab.classList.add('active');
        });
    });

    document.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        const type = button.dataset.type;
        const index = parseInt(button.dataset.index, 10);
        if (button.dataset.action === 'edit') {
            if (type === 'testimonial') {
                openTestimonialModal(index);
            } else {
                openGalleryModal(index);
            }
        } else {
            deleteItem(type, index);
        }
    });
};

const init = async () => {
    await loadData();

    const savedLang = localStorage.getItem('siteLang') || DEFAULT_LANG;
    setLanguage(savedLang);
    updateActiveLanguage(savedLang);

    renderTestimonials();
    renderGallery();

    document.querySelectorAll('.language-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
            updateActiveLanguage(lang);
        });
    });

    document.querySelectorAll('.language-option').forEach((option) => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);
            updateActiveLanguage(lang);
            const dropdown = document.getElementById('languageDropdown');
            if (dropdown) dropdown.classList.remove('active');
        });
    });

    const globeButton = document.getElementById('globeButton');
    const languageDropdown = document.getElementById('languageDropdown');
    if (globeButton && languageDropdown) {
        globeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            languageDropdown.classList.toggle('active');
        });
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.language-switcher')) {
                languageDropdown.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('.mobile-lang-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-mobile-lang');
            setLanguage(lang);
            updateActiveLanguage(lang);
        });
    });

    if (isAdminMode()) {
        openAdmin();
        setupAdminEvents();
        renderAdminLists();
    }

    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    const mobileOverlay = document.getElementById('mobileMenuOverlay');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const menuIcon = document.getElementById('menuIcon');

    const openMobileMenu = () => {
        if (!navMenu || !mobileOverlay) return;
        navMenu.classList.remove('hidden');
        navMenu.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            navMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            if (menuIcon) menuIcon.textContent = '×';
        }, 10);
    };

    const closeMobileMenu = () => {
        if (!navMenu || !mobileOverlay) return;
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        if (menuIcon) menuIcon.textContent = '☰';
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            if (window.innerWidth < 768) {
                navMenu.classList.add('hidden');
                navMenu.style.display = 'none';
            }
        }, 400);
    };

    if (menuBtn) menuBtn.addEventListener('click', (event) => {
        event.preventDefault();
        if (navMenu && navMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
    document.querySelectorAll('#navMenu a').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                closeMobileMenu();
            }
        });
    });

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

        floatingToggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const isOpen = floatingActions.classList.toggle('open');
            floatingToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        floatingMenu.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                closeFloatingMenu();
            }
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('#floatingActions')) {
                closeFloatingMenu();
            }
        });

        const footer = document.querySelector('footer');
        if (footer && 'IntersectionObserver' in window) {
            const footerObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
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

    if (cookieConsent && cookieAccept && cookieDecline) {
        const cookieChoice = localStorage.getItem('cookieConsent');

        if (!cookieChoice) {
            setTimeout(() => {
                cookieConsent.classList.add('show');
            }, 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsent.classList.remove('show');
        });

        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieConsent.classList.remove('show');
        });
    }

    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('hidden');
            }
        }, 500);
    });

    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === '/') {
            event.preventDefault();
            if (!isAdminMode()) {
                toggleAdminMode();
            }
        }
    });

    document.addEventListener('click', (event) => {
        const toggle = event.target.closest('.review-toggle');
        if (!toggle) return;
        const card = toggle.closest('.review-card');
        if (!card) return;
        const isExpanded = card.classList.toggle('expanded');
        toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        toggle.textContent = getToggleLabel(isExpanded);
    });
};

document.addEventListener('DOMContentLoaded', init);
