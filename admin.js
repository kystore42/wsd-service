
let adminData = {};
const ADMIN_PASSWORD = 'eratosfen';

class AdminManager {
    constructor() {
        this.adminPanel = document.getElementById('adminPanel');
        this.adminCloseBtn = document.getElementById('adminCloseBtn');
        this.adminSaveBtn = document.getElementById('adminSaveBtn');
        this.adminResetBtn = document.getElementById('adminResetBtn');
        this.tabs = document.querySelectorAll('.admin-tab');
        this.currentEditIndex = null; 
        this.currentPage = 1; 
        this.itemsPerPage = 3; 
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
            if (confirm('Reset all changes to default?')) {
                this.resetToDefault();
            }
        });

        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        const addTestimonialBtn = document.getElementById('addTestimonialBtn');
        if (addTestimonialBtn) {
            addTestimonialBtn.addEventListener('click', () => this.openTestimonialModal());
        }

        const modalSaveBtn = document.getElementById('modalSaveBtn');
        if (modalSaveBtn) {
            modalSaveBtn.addEventListener('click', () => this.saveTestimonialModal());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('testimonialModal').style.display = 'none';
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
        
        if (tabName === 'testimonials') {
            this.currentPage = 1;
            this.renderTestimonialsList();
        }
    }

    populateForm() {
        console.log('populateForm called, adminData:', adminData);
        
        document.getElementById('statsStudents').value = adminData?.stats?.students || '150';
        document.getElementById('statsYears').value = adminData?.stats?.years || '7';
        document.getElementById('statsSuccess').value = adminData?.stats?.success_rate || '95';
        document.getElementById('statsSessions').value = adminData?.stats?.sessions || '500';

        if (!adminData.testimonials) {
            adminData.testimonials = [];
        }
        
        console.log('Testimonials to render:', adminData.testimonials);
        this.renderTestimonialsList();
    }

    renderTestimonialsList() {
        const list = document.getElementById('testimonialsList');
        const pagination = document.getElementById('testimonialsPagination');
        const pageInfo = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (!list) {
            console.error('testimonialsList element not found!');
            return;
        }
        
        console.log('renderTestimonialsList called with:', adminData.testimonials);
        list.innerHTML = '';

        if (!adminData.testimonials || adminData.testimonials.length === 0) {
            list.innerHTML = '<p style="color: #999; font-size: 14px;">No testimonials yet. Click "Add Testimonial" to create one.</p>';
            pagination.style.display = 'none';
            return;
        }

        const totalTestimonials = adminData.testimonials.length;
        const totalPages = Math.ceil(totalTestimonials / this.itemsPerPage);
        
        if (this.currentPage < 1) this.currentPage = 1;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageTestimonials = adminData.testimonials.slice(startIndex, endIndex);
        
        pageTestimonials.forEach((testimonial, pageIndex) => {
            const actualIndex = startIndex + pageIndex; 
            const item = document.createElement('div');
            item.className = 'admin-testimonial-item';
            let mediaPreview = '';
            
            if (testimonial.photo) {
                const photoUrl = this.normalizePhotoUrl(testimonial.photo);
                mediaPreview = `<img src="${photoUrl}" class="admin-testimonial-preview" alt="Testimonial photo" style="max-width: 100%; max-height: 80px; border-radius: 4px; margin: 8px 0;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23e5e7eb%22 width=%2280%22 height=%2280%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2212%22 fill=%22%239ca3af%22 text-anchor=%22middle%22 dy=%22.3em%22%3E🖼️%3C/text%3E%3C/svg%3E'">`;
            }
            if (testimonial.video) {
                mediaPreview += `<p style="font-size: 12px; color: #666;">📹 Video: ${testimonial.video}</p>`;
            }
            
            item.innerHTML = `
                <h4>${testimonial.name} - ${testimonial.role}</h4>
                <div class="admin-testimonial-item-text">${testimonial.text}</div>
                ${mediaPreview}
                <div class="admin-testimonial-actions">
                    <button class="admin-btn-small admin-btn-edit" onclick="adminManager.openTestimonialModal(${actualIndex})">Edit</button>
                    <button class="admin-btn-small admin-btn-delete" onclick="adminManager.deleteTestimonial(${actualIndex})">Delete</button>
                </div>
            `;
            list.appendChild(item);
        });
        
        if (totalPages > 1) {
            pagination.style.display = 'flex';
            pageInfo.textContent = `Page ${this.currentPage} of ${totalPages} (${totalTestimonials} total)`;
            
            prevBtn.disabled = this.currentPage === 1;
            nextBtn.disabled = this.currentPage === totalPages;
            
            prevBtn.style.opacity = this.currentPage === 1 ? '0.5' : '1';
            nextBtn.style.opacity = this.currentPage === totalPages ? '0.5' : '1';
        } else {
            pagination.style.display = 'none';
        }
        
        console.log(`Rendered page ${this.currentPage} of ${totalPages}, showing ${pageTestimonials.length} testimonials`);
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderTestimonialsList();
            console.log('Moved to page:', this.currentPage);
        }
    }

    nextPage() {
        const totalPages = Math.ceil((adminData.testimonials || []).length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderTestimonialsList();
            console.log('Moved to page:', this.currentPage);
        }
    }

    openTestimonialModal(index = null) {
        const modal = document.getElementById('testimonialModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalName = document.getElementById('modalName');
        const modalRole = document.getElementById('modalRole');
        const modalText = document.getElementById('modalText');
        const modalPhoto = document.getElementById('modalPhoto');
        const modalVideo = document.getElementById('modalVideo');
        
        if (index === null) {
            modalTitle.textContent = 'Add New Testimonial';
            modalName.value = '';
            modalRole.value = '';
            modalText.value = '';
            modalPhoto.value = '';
            modalVideo.value = '';
            this.currentEditIndex = null;
        } else {
            if (!adminData.testimonials || !adminData.testimonials[index]) {
                alert('Testimonial not found!');
                return;
            }
            
            const testimonial = adminData.testimonials[index];
            modalTitle.textContent = 'Edit Testimonial';
            modalName.value = testimonial.name || '';
            modalRole.value = testimonial.role || '';
            modalText.value = testimonial.text || '';
            modalPhoto.value = testimonial.photo || '';
            modalVideo.value = testimonial.video || '';
            this.currentEditIndex = index;
        }
        
        modal.style.display = 'flex';
        modalName.focus();
    }

    saveTestimonialModal() {
        const modalName = document.getElementById('modalName');
        const modalRole = document.getElementById('modalRole');
        const modalText = document.getElementById('modalText');
        const modalPhoto = document.getElementById('modalPhoto');
        const modalVideo = document.getElementById('modalVideo');
        
        if (!modalName.value.trim()) {
            alert('Please enter a name');
            modalName.focus();
            return;
        }
        
        if (!modalRole.value.trim()) {
            alert('Please enter a role');
            modalRole.focus();
            return;
        }
        
        if (!modalText.value.trim()) {
            alert('Please enter testimonial text');
            modalText.focus();
            return;
        }
        
        if (!adminData.testimonials) {
            adminData.testimonials = [];
        }
        
        const testimonialData = {
            name: modalName.value.trim(),
            role: modalRole.value.trim(),
            text: modalText.value.trim(),
            photo: modalPhoto.value.trim() || null,
            video: modalVideo.value.trim() || null
        };
        
        if (this.currentEditIndex === null) {
            adminData.testimonials.push(testimonialData);
            console.log('Testimonial added:', testimonialData);
            
            this.currentPage = 1;
        } else {
            Object.assign(adminData.testimonials[this.currentEditIndex], testimonialData);
            console.log('Testimonial updated:', testimonialData);
        }
        
        document.getElementById('testimonialModal').style.display = 'none';
        this.renderTestimonialsList();
        
        this.applyContent();
    }

    deleteTestimonial(index) {
        if (!adminData.testimonials || !adminData.testimonials[index]) {
            alert('Testimonial not found!');
            return;
        }
        
        if (confirm('Delete this testimonial?')) {
            adminData.testimonials.splice(index, 1);
            console.log('Testimonial deleted');
            
            const totalPages = Math.ceil((adminData.testimonials || []).length / this.itemsPerPage);
            if (this.currentPage > totalPages && totalPages > 0) {
                this.currentPage = totalPages;
            }
            
            this.renderTestimonialsList();
            
            this.applyContent();
        }
    }

    saveChanges() {
        adminData.stats = {
            students: document.getElementById('statsStudents').value,
            years: document.getElementById('statsYears').value,
            success_rate: document.getElementById('statsSuccess').value,
            sessions: document.getElementById('statsSessions').value
        };

        if (!adminData.testimonials) {
            adminData.testimonials = [];
        }

        localStorage.setItem('adminContent', JSON.stringify(adminData));
        console.log('Changes saved to localStorage:', adminData);
        
        this.applyContent();
        
        alert('✅ Changes saved successfully!');
    }

    resetToDefault() {
        localStorage.removeItem('adminContent');
        adminData = this.getDefaultContent();
        this.populateForm();
        this.applyContent();
        alert('✅ Reset to default!');
    }

    loadContent() {
        console.log('loadContent called');
        
        const saved = localStorage.getItem('adminContent');
        if (saved) {
            try {
                adminData = JSON.parse(saved);
                console.log('Loaded from localStorage:', adminData);
                setTimeout(() => this.applyContent(), 100);
                if (this.isAdminMode()) {
                    setTimeout(() => this.populateForm(), 150);
                }
            } catch (e) {
                console.error('Error parsing saved content:', e);
                adminData = this.getDefaultContent();
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
                    if (!adminData.testimonials) {
                        adminData.testimonials = [];
                    }
                    this.applyContent();
                    if (this.isAdminMode()) {
                        setTimeout(() => this.populateForm(), 150);
                    }
                })
                .catch(err => {
                    console.error('Error loading content.json:', err);
                    adminData = this.getDefaultContent();
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
            ],
            hero: {
                heading: 'Empowering Children with Special Needs',
                description: 'My individualized approach helps children overcome challenges and thrive socially and academically.'
            },
            contact: {
                email: 'josephblazkowicz543@gmail.com',
                phone: '+48355123456',
                address: 'Wroclaw, Poland'
            }
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
