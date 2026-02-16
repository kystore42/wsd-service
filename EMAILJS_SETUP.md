# Настройка EmailJS для отправки формы на почту

## Шаг 1: Регистрация в EmailJS

1. Перейдите на сайт: https://www.emailjs.com/
2. Нажмите **Sign Up** и создайте бесплатный аккаунт
3. Подтвердите email адрес

## Шаг 2: Добавление Email Service

1. В панели управления перейдите в **Email Services**
2. Нажмите **Add New Service**
3. Выберите ваш почтовый провайдер (Gmail, Outlook, Yahoo и т.д.)
4. Следуйте инструкциям для подключения вашей почты
5. **Скопируйте Service ID** (например: `service_abc1234`)

## Шаг 3: Создание Email Template

1. Перейдите в **Email Templates**
2. Нажмите **Create New Template**
3. Настройте шаблон письма:

### Пример шаблона:

**Subject:** Новая заявка с сайта

**Content:**
```
Здравствуйте!

Вы получили новую заявку с вашего сайта:

Имя: {{from_name}}
Телефон: {{from_phone}}
Сообщение: {{message}}

---
Это автоматическое письмо от формы бронирования
```

4. В настройках укажите:
   - **To Email:** {{to_email}} или ваш конкретный email
   - **From Name:** {{from_name}}
   - **Reply To:** можно оставить пустым или добавить {{from_phone}}

5. **Скопируйте Template ID** (например: `template_xyz5678`)

## Шаг 4: Получение Public Key

1. Перейдите в **Account** → **General**
2. Найдите раздел **API Keys**
3. **Скопируйте Public Key** (например: `AbCdEfGhIjKlMnOp`)

## Шаг 5: Обновление кода

Откройте файл `main.js` и замените следующие значения на свои:

```javascript
const response = await emailjs.send(
    'YOUR_SERVICE_ID',      // Замените на ваш Service ID
    'YOUR_TEMPLATE_ID',     // Замените на ваш Template ID
    templateParams,
    'JZfCCt7hVHjixlTfb'     // Замените на ваш Public Key
);
```

И замените email в объекте templateParams:
```javascript
const templateParams = {
    from_name: data.fullName,
    from_phone: data.phoneNumber,
    message: data.problemDescription,
    to_email: 'YOUR_EMAIL@example.com' // Ваша почта
};
```

## Пример готового кода:

```javascript
const templateParams = {
    from_name: data.fullName,
    from_phone: data.phoneNumber,
    message: data.problemDescription,
    to_email: 'myemail@gmail.com'
};

const response = await emailjs.send(
    'service_abc1234',
    'template_xyz5678',
    templateParams,
    'AbCdEfGhIjKlMnOp'
);
```

## Тестирование

1. Сохраните изменения в `main.js`
2. Откройте `index.html` в браузере
3. Заполните форму и отправьте тестовую заявку
4. Проверьте вашу почту

## Лимиты бесплатного плана

- **200 email в месяц**
- Этого достаточно для личного сайта
- Если нужно больше - можно перейти на платный план

## Поддержка

Если письма не приходят:
1. Проверьте папку "Спам"
2. Убедитесь что все ID и ключи правильные
3. Проверьте консоль браузера (F12) на наличие ошибок
4. В настройках EmailJS убедитесь что сервис активирован

## Безопасность

✅ Public Key безопасен для использования на клиенте
✅ EmailJS защищает от спама встроенной капчей
✅ Ваши данные для входа в почту не нужны в коде
