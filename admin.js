
let adminData = {};
const ADMIN_PASSWORD = 'eratosfen';

class AdminManager {
    constructor() {
        this.adminPanel = document.getElementById('adminPanel');
        this.adminCloseBtn = document.getElementById('adminCloseBtn');
        this.adminSaveBtn = document.getElementById('adminSaveBtn');
        this.adminResetBtn = document.getElementById('adminResetBtn');
        this.tabs = document.querySelectorAll('.admin-tab');
        this.init();
    }

    init() {
        this.loadContent();
        
        if (this.isAdminMode()) {
            this.setupAdminPanel();
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                this.toggleAdminMode();
            }
        });
    }

    isAdminMode() {
        return new URL(window.location).searchParams.get('admin') === 'true';
    }

    normalizePhotoUrl(photoUrl) {
        if (!photoUrl || typeof photoUrl !== 'string') return '';

        let url = photoUrl.trim();
        if (!url) return '';

        if (url.includes('imgur.com')) {
            if (!url.includes('i.imgur.com')) {
                const match = url.match(/imgur\.com\/([a-zA-Z0-9]+)/);
                if (match) {
                    url = `https://i.imgur.com/${match[1]}`;
                }
            }

            if (url.includes('i.imgur.com') && !url.match(/\.(jpg|jpeg|png|gif)(\?.*)?$/)) {
                url += '.jpg';
            }
        }

        return url;
    }

    toggleAdminMode() {
        const passwordModal = document.getElementById('passwordModal');
        const passwordInput = document.getElementById('passwordInput');
        const passwordSubmitBtn = document.getElementById('passwordSubmitBtn');
        
        if (passwordModal) {
            passwordModal.style.display = 'flex';
            passwordInput.value = '';
            passwordInput.focus();
            
            const handleSubmit = () => {
                const pwd = passwordInput.value;
                if (pwd === ADMIN_PASSWORD) {
                    passwordModal.style.display = 'none';
                    window.location.href = window.location.href.split('?')[0] + '?admin=true';
                } else {
                    passwordInput.classList.add('error-shake');
                    setTimeout(() => {
                        passwordInput.classList.remove('error-shake');
                    }, 500);
                    passwordInput.style.borderColor = '#dc2626';
                    setTimeout(() => {
                        passwordInput.style.borderColor = '#d1d5db';
                    }, 1500);
                }
            };
            
            const newSubmitBtn = passwordSubmitBtn.cloneNode(true);
            passwordSubmitBtn.parentNode.replaceChild(newSubmitBtn, passwordSubmitBtn);
            
            newSubmitBtn.addEventListener('click', handleSubmit);
            
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSubmit();
                }
            });
        } else {
            const pwd = prompt('Enter admin password:');
            if (pwd === ADMIN_PASSWORD) {
                window.location.href = window.location.href.split('?')[0] + '?admin=true';
            } else {
                alert('Incorrect password!');
            }
        }
    }

    exitAdminMode() {
        window.location.href = window.location.href.split('?')[0];
    }

    setupAdminPanel() {
        this.adminCloseBtn.addEventListener('click', () => {
            this.exitAdminMode();
        });

        this.adminSaveBtn.addEventListener('click', () => {
            this.saveChanges();
        });

        this.adminResetBtn.addEventListener('click', () => {
            if (confirm('Сбросить все изменения на значения по умолчанию?')) {
                this.resetToDefault();
            }
        });

        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('passwordModal').style.display = 'none';
            }
        });

        this.loadContent();
        
        setTimeout(() => {
            this.switchTab('stats');
            this.populateForm();
        }, 100);

        setTimeout(() => {
            this.adminPanel.classList.add('active');
        }, 500);
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        document.querySelectorAll('.admin-tab').forEach(btn => {
            btn.classList.remove('active');
        });

        const contentEl = document.getElementById(`${tabName}-content`);
        const btnEl = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (contentEl) {
            contentEl.classList.add('active');
            contentEl.style.display = 'block';
            console.log('Showing content:', contentEl);
        } else {
            console.error('Tab content not found:', `${tabName}-content`);
        }
        
        if (btnEl) {
            btnEl.classList.add('active');
        } else {
            console.error('Tab button not found:', `[data-tab="${tabName}"]`);
        }
    }

    populateForm() {
        console.log('populateForm called, adminData:', adminData);
        
        // Stats
        document.getElementById('statsStudents').value = adminData?.stats?.students || '150';
        document.getElementById('statsYears').value = adminData?.stats?.years || '7';
        document.getElementById('statsSuccess').value = adminData?.stats?.success_rate || '95';
        document.getElementById('statsSessions').value = adminData?.stats?.sessions || '500';

        // Contacts
        document.getElementById('contactsEmail').value = adminData?.contact?.email || 'josephblazkowicz543@gmail.com';
        document.getElementById('contactsPhone').value = adminData?.contact?.phone || '+48355123456';
        document.getElementById('contactsCallFrom').value = adminData?.contact?.callHours?.from || '09:00';
        document.getElementById('contactsCallTo').value = adminData?.contact?.callHours?.to || '18:00';
        document.getElementById('contactsWeekday').value = adminData?.contact?.workingHours?.weekday || '09:00-18:00';
        document.getElementById('contactsWeekend').value = adminData?.contact?.workingHours?.weekend || 'Закрыто';
        document.getElementById('contactsLocation').value = adminData?.contact?.location || 'Вроцлав, Польша';
    }

    saveChanges() {
        // Save stats
        adminData.stats = {
            students: document.getElementById('statsStudents').value,
            years: document.getElementById('statsYears').value,
            success_rate: document.getElementById('statsSuccess').value,
            sessions: document.getElementById('statsSessions').value
        };

        // Save contacts
        const newPhone = document.getElementById('contactsPhone').value;
        const newEmail = document.getElementById('contactsEmail').value;
        const newCallFrom = document.getElementById('contactsCallFrom').value;
        const newCallTo = document.getElementById('contactsCallTo').value;
        const newWeekday = document.getElementById('contactsWeekday').value;
        const newWeekend = document.getElementById('contactsWeekend').value;
        const newLocation = document.getElementById('contactsLocation').value;

        adminData.contact = {
            email: newEmail,
            phone: newPhone,
            callHours: {
                from: newCallFrom,
                to: newCallTo
            },
            workingHours: {
                weekday: newWeekday,
                weekend: newWeekend
            },
            location: newLocation
        };

        localStorage.setItem('adminContent', JSON.stringify(adminData));
        console.log('Changes saved to localStorage:', adminData);
        console.log('Phone saved:', adminData.contact.phone);
        
        this.updatePageContacts();
        this.applyContent();
        
        alert('✅ Изменения сохранены успешно!');
    }

    resetToDefault() {
        localStorage.removeItem('adminContent');
        adminData = this.getDefaultContent();
        this.populateForm();
        this.updatePageContacts();
        this.applyContent();
        alert('✅ Сброс на значения по умолчанию!');
    }

    updatePageContacts() {
        if (!adminData.contact) {
            console.warn('adminData.contact not found!');
            return;
        }

        console.log('Updating page contacts with:', adminData.contact);

        // Get current language
        const lang = document.documentElement.lang || 'en';

        // Update email
        const emailEl = document.getElementById('contactEmail');
        if (emailEl) {
            emailEl.href = `mailto:${adminData.contact.email}`;
            emailEl.textContent = adminData.contact.email;
            console.log('Email updated:', adminData.contact.email);
        } else {
            console.warn('contactEmail element not found');
        }

        // Update phone
        const phoneEl = document.getElementById('contactPhone');
        if (phoneEl) {
            const phoneFormatted = adminData.contact.phone;
            const phoneForLink = phoneFormatted.replace(/\s/g, '');
            phoneEl.href = `tel:${phoneForLink}`;
            phoneEl.textContent = phoneFormatted;
            console.log('Phone updated to:', phoneFormatted, 'Link:', `tel:${phoneForLink}`);
        } else {
            console.warn('contactPhone element not found');
        }

        // Update call hours label with translation
        const callHoursEl = document.getElementById('callHours');
        if (callHoursEl && adminData.contact.callHours?.from && adminData.contact.callHours?.to) {
            let callHoursLabel = 'Calls available';
            if (translations && translations[lang]) {
                callHoursLabel = translations[lang]['call_hours'] || callHoursLabel;
            }
            callHoursEl.textContent = `📞 ${callHoursLabel}: ${adminData.contact.callHours.from} - ${adminData.contact.callHours.to}`;
            console.log('Call hours updated');
        }

        // Update location
        const locationEl = document.getElementById('contactLocation');
        if (locationEl) {
            locationEl.textContent = adminData.contact.location;
            console.log('Location updated:', adminData.contact.location);
        } else {
            console.warn('contactLocation element not found');
        }

        // Update WhatsApp links
        const whatsappPhone = adminData.contact.phone.replace(/\s/g, '').replace('+', '');
        console.log('WhatsApp phone:', whatsappPhone);
        
        const whatsappLink = document.getElementById('whatsappLink');
        if (whatsappLink) {
            whatsappLink.href = `https://wa.me/${whatsappPhone}`;
            console.log('WhatsApp link updated:', whatsappLink.href);
        } else {
            console.warn('whatsappLink element not found');
        }
        
        const whatsappFloating = document.getElementById('whatsappFloating');
        if (whatsappFloating) {
            whatsappFloating.href = `https://wa.me/${whatsappPhone}`;
            console.log('WhatsApp floating updated:', whatsappFloating.href);
        } else {
            console.warn('whatsappFloating element not found');
        }

        // Update JSON-LD schemas
        this.updateJsonLD();
        
        console.log('✅ Page contacts fully updated');
    }

    updateJsonLD() {
        if (!adminData.contact) return;

        const phoneFormatted = adminData.contact.phone;
        const email = adminData.contact.email;

        // Find all JSON-LD scripts
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        
        scripts.forEach(script => {
            try {
                const jsonld = JSON.parse(script.textContent);
                
                // Update phone in different schema types
                if (jsonld.telephone) {
                    jsonld.telephone = phoneFormatted;
                }
                if (jsonld.email) {
                    jsonld.email = email;
                }
                if (jsonld.contactPoint?.telephone) {
                    jsonld.contactPoint.telephone = phoneFormatted;
                }
                if (jsonld.contactPoint?.email) {
                    jsonld.contactPoint.email = email;
                }
                
                // Update the script content
                script.textContent = JSON.stringify(jsonld, null, 2);
            } catch (e) {
                console.error('Error updating JSON-LD:', e);
            }
        });
    }

    loadContent() {
        console.log('loadContent called');
        
        const saved = localStorage.getItem('adminContent');
        if (saved) {
            try {
                adminData = JSON.parse(saved);
                console.log('Loaded from localStorage:', adminData);
                console.log('Phone from localStorage:', adminData.contact?.phone);
                
                // Immediately update page contacts
                setTimeout(() => this.updatePageContacts(), 50);
                
                this.applyContent();
                if (this.isAdminMode()) {
                    setTimeout(() => this.populateForm(), 150);
                }
            } catch (e) {
                console.error('Error parsing saved content:', e);
                adminData = this.getDefaultContent();
                this.updatePageContacts();
            }
        } else {
            console.log('Fetching content.json...');
            fetch('content.json')
                .then(response => {
                    console.log('content.json response:', response);
                    return response.json();
                })
                .then(data => {
                    console.log('content.json data loaded:', data);
                    adminData = data;
                    if (!adminData.contact) {
                        adminData.contact = {
                            email: 'josephblazkowicz543@gmail.com',
                            phone: '+48355123456',
                            callHours: {
                                from: '09:00',
                                to: '18:00'
                            },
                            workingHours: {
                                weekday: '09:00-18:00',
                                weekend: 'Закрыто'
                            },
                            location: 'Вроцлав, Польша'
                        };
                    }
                    // Update page contacts
                    this.updatePageContacts();
                    this.applyContent();
                    if (this.isAdminMode()) {
                        setTimeout(() => this.populateForm(), 150);
                    }
                })
                .catch(err => {
                    console.error('Error loading content.json:', err);
                    adminData = this.getDefaultContent();
                    this.updatePageContacts();
                    if (this.isAdminMode()) {
                        setTimeout(() => this.populateForm(), 150);
                    }
                });
        }
    }

    getDefaultContent() {
        return {
            stats: {
                students: '150',
                years: '7',
                success_rate: '95',
                sessions: '500'
            },
            contact: {
                email: 'josephblazkowicz543@gmail.com',
                phone: '+48355123456',
                callHours: {
                    from: '09:00',
                    to: '18:00'
                },
                workingHours: {
                    weekday: '09:00-18:00',
                    weekend: 'Закрыто'
                },
                location: 'Вроцлав, Польша'
            },
            hero: {
                heading: 'Empowering Children with Special Needs',
                description: 'My individualized approach helps children overcome challenges and thrive socially and academically.'
            },
            testimonials: [
                {
                    name: 'Anna K.',
                    role: 'Parent',
                    text: 'Wonderful experience! My son now enjoys learning and his confidence has grown tremendously.',
                    photo: null,
                    video: null
                },
                {
                    name: 'Maria S.',
                    role: 'Parent',
                    text: "Professional and caring approach. My daughter's reading skills improved significantly!",
                    photo: null,
                    video: null
                },
                {
                    name: 'Piotr W.',
                    role: 'Parent',
                    text: 'Amazing results! My son can now focus better and his grades have improved.',
                    photo: null,
                    video: null
                },
                {
                    name: 'Oksana L.',
                    role: 'Parent',
                    text: 'My daughter struggled with reading, but now she reads confidently. Thank you for your patience!',
                    photo: null,
                    video: null
                },
                {
                    name: 'Tomasz K.',
                    role: 'Parent',
                    text: "Exceptional teacher! Our son's behavior and academic performance improved dramatically.",
                    photo: null,
                    video: null
                },
                {
                    name: 'Elena M.',
                    role: 'Parent',
                    text: 'Highly recommend! A caring professional who truly understands children with special needs.',
                    photo: null,
                    video: null
                }
            ]
        };
    }

    applyContent() {
        if (!adminData || Object.keys(adminData).length === 0) return;

        if (adminData.stats) {
            const counters = document.querySelectorAll('.counter');
            const statMap = {
                0: 'students',      
                1: 'years',         
                2: 'success_rate',  
                3: 'sessions'      
            };

            counters.forEach((counter, index) => {
                const key = statMap[index];
                if (key && adminData.stats[key]) {
                    const target = parseInt(adminData.stats[key]);
                    counter.classList.remove('counted');
                    counter.textContent = '0';
                    counter.dataset.target = target;
                    
                    setTimeout(() => {
                        const duration = 2000;
                        const increment = target / (duration / 16);
                        let current = 0;
                        
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.textContent = Math.floor(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target;
                                counter.classList.add('counted');
                            }
                        };
                        
                        updateCounter();
                    }, 100);
                }
            });
        }

        if (adminData.testimonials && adminData.testimonials.length > 0) {
            const testimonialsTrack = document.getElementById('testimonialsTrack');
            if (testimonialsTrack) {
                testimonialsTrack.innerHTML = '';
                
                adminData.testimonials.forEach((testimonial) => {
                    const slide = document.createElement('div');
                    slide.className = 'testimonial-slide';
                    const initials = testimonial.name.charAt(0).toUpperCase();
                    
                    let mediaHtml = '';
                    if (testimonial.photo) {
                        const photoUrl = this.normalizePhotoUrl(testimonial.photo);
                        mediaHtml += `<img src="${photoUrl}" class="testimonial-media" alt="Testimonial photo" style="max-width: 100%; max-height: 180px; border-radius: 8px; margin: 12px 0; object-fit: cover; display: block;" loading="lazy">`;
                    }
                    if (testimonial.video) {
                        mediaHtml += `<a href="${testimonial.video}" target="_blank" style="display: inline-block; margin-top: 8px; color: #d97706; text-decoration: none; font-size: 14px; font-weight: 600;">📹 Watch Video</a>`;
                    }
                    
                    slide.innerHTML = `
                        <div class="testimonial-card">
                            <span class="testimonial-quote">"</span>
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">${initials}</div>
                                <div>
                                    <h4 class="font-bold text-lg text-gray-800">${testimonial.name}</h4>
                                    <p class="text-sm text-gray-500">${testimonial.role}</p>
                                </div>
                            </div>
                            <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
                            <p class="testimonial-text">${testimonial.text}</p>
                            ${mediaHtml}
                        </div>
                    `;
                    
                    testimonialsTrack.appendChild(slide);
                });
                
                console.log('Testimonials rendered, reinitializing carousel...');
                
                setTimeout(() => {
                    if (typeof window.reinitTestimonialsCarousel === 'function') {
                        window.reinitTestimonialsCarousel();
                        console.log('Carousel reinitialized');
                    } else {
                        console.warn('reinitTestimonialsCarousel function not found');
                    }
                }, 100);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.adminManager = new AdminManager();
});
