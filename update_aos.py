import re

# Read the file
with open('e:/teach/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update testimonial cards
testimonials = [
    ('A', '100'),
    ('M', '200'),
    ('P', '300'),
]

for avatar, delay in testimonials:
    # Find the pattern for each testimonial
    pattern = rf'(<div class="testimonial-slide">\s+<div class="testimonial-card")>\s+(<span class="testimonial-quote">"</span>\s+<div class="testimonial-header">\s+<div class="testimonial-avatar">{avatar}</div>)'
    replacement = rf'\1 data-aos="fade-up" data-aos-delay="{delay}">\n                                    \2'
    content = re.sub(pattern, replacement, content, count=1)

# Add loading="lazy" to all diploma images
diploma_pattern = r'(<img src="diploma/[1-8]\.png" alt="Diploma \d+")(>)'
content = re.sub(diploma_pattern, r'\1 loading="lazy"\2', content)

# Update FAQ section title
content = re.sub(
    r'(<h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-orange-800 mb-4")( data-i18n-key="section_faq">)',
    r'\1 data-aos="fade-up"\2',
    content
)

# Update FAQ items with delays
faq_delays = ['50', '100', '150', '200', '250', '300']
for i, delay in enumerate(faq_delays, 1):
    pattern = rf'(<div class="faq-item">)\s+(<div class="faq-question">\s+<h3 class="faq-question-text" data-i18n-key="faq{i}_question">)'
    replacement = rf'<div class="faq-item" data-aos="fade-up" data-aos-delay="{delay}">\n                        \2'
    content = re.sub(pattern, replacement, content, count=1)

# Update booking section title
content = re.sub(
    r'(<h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-orange-800 mb-6 sm:mb-8 md:mb-12")( data-i18n-key="section_booking">)',
    r'\1 data-aos="fade-up"\2',
    content
)

# Update credentials section title
content = re.sub(
    r'(<h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-orange-800 mb-4")( data-i18n-key="section_credentials">)',
    r'\1 data-aos="fade-up"\2',
    content
)

# Write the file back
with open('e:/teach/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated AOS animations and lazy loading!")
