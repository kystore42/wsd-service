# SEO и Cookie Consent

## ✅ Текущий аудит (основные замечания)

1. **Плейсхолдеры URL**
- В [index.html](index.html#L10-L33) стоят `https://yourwebsite.com/` и `og-image.jpg`.
- Эти же URL используются в Schema.org JSON-LD.

2. **Ошибка в JSON-LD**
- В блоке `sameAs` есть лишняя запятая после последней ссылки. Это делает JSON недействительным.

3. **Нет canonical/OG/Twitter для доп. страниц**
- В [reviews-gallery.html](reviews-gallery.html#L6-L15) и [privacy.html](privacy.html#L6-L15) нет canonical/OG/Twitter тегов.

4. **Hreflang отсутствует**
- Есть `og:locale` и `og:locale:alternate`, но нет `<link rel="alternate" hreflang="...">`.

5. **Meta keywords**
- `meta keywords` уже почти не используется поисковиками. Можно оставить, но это не влияет на ранжирование.

## 🛠️ Что обновить

### 1) Основные URL и социальные превью
В [index.html](index.html#L10-L33):
```html
<link rel="canonical" href="https://example.com/">
<meta property="og:url" content="https://example.com/">
<meta property="og:image" content="https://example.com/img/og-image.jpg">
<meta name="twitter:url" content="https://example.com/">
```

### 2) Исправить JSON-LD и реальные ссылки
В [index.html](index.html#L47-L92):
```json
"url": "https://example.com",
"logo": "https://example.com/img/logo.png",
"image": "https://example.com/img/woman.png",
"sameAs": [
  "https://facebook.com/yourprofile",
  "https://instagram.com/yourprofile"
]
```

### 3) Canonical/OG/Twitter для страниц
Добавить в `<head>`:
- [reviews-gallery.html](reviews-gallery.html#L6-L15)
- [privacy.html](privacy.html#L6-L15)

Пример:
```html
<link rel="canonical" href="https://example.com/reviews-gallery.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://example.com/reviews-gallery.html">
<meta property="og:title" content="Reviews & Gallery">
<meta property="og:description" content="Reviews and gallery.">
<meta property="og:image" content="https://example.com/img/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Reviews & Gallery">
<meta name="twitter:description" content="Reviews and gallery.">
<meta name="twitter:image" content="https://example.com/img/og-image.jpg">
```

### 4) Hreflang
В `<head>` добавить:
```html
<link rel="alternate" href="https://example.com/" hreflang="pl">
<link rel="alternate" href="https://example.com/?lang=en" hreflang="en">
<link rel="alternate" href="https://example.com/?lang=uk" hreflang="uk">
<link rel="alternate" href="https://example.com/" hreflang="x-default">
```

## 🚀 Проверка после обновлений

1. **Google Rich Results Test**
- https://search.google.com/test/rich-results

2. **Facebook Sharing Debugger**
- https://developers.facebook.com/tools/debug/

3. **Twitter Card Validator**
- https://cards-dev.twitter.com/validator

4. **PageSpeed Insights**
- https://pagespeed.web.dev/

## 📊 Опционально

### Google Analytics
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Google Search Console
1. https://search.google.com/search-console
2. Добавить сайт
3. Загрузить `sitemap.xml`

### Sitemap.xml (минимум)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-02-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/reviews-gallery.html</loc>
    <lastmod>2026-02-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://example.com/privacy.html</loc>
    <lastmod>2026-02-16</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

