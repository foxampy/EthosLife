# i18n (Internationalization) Guide

## Quick Start

Все страницы теперь используют систему переводов через `useI18n` hook.

### Пример использования:

```tsx
import { useI18n } from '@/i18n';

function MyComponent() {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('nav.dashboard')}</h1>
      <p>{t('dashboard.welcome')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

## Структура ключей

```
app.*          - Название приложения, слоган
nav.*          - Навигация (меню, ссылки)
auth.*         - Авторизация (логин, регистрация)
health.*       - Модули здоровья
  health.modules.* - Названия 7 модулей
  health.addData   - Добавить данные
  health.viewHistory - История
dashboard.*    - Личный кабинет
pricing.*      - Тарифы и подписки
wallet.*       - Кошелёк UNITY
aiChat.*       - ИИ-чат
specialists.*  - Специалисты
common.*       - Общие кнопки и действия
errors.*       - Сообщения об ошибках
time.*         - Форматы времени
landing.*      - Главная страница
onboarding.*   - Онбординг
notifications.* - Уведомления
```

## Как добавить новый перевод

### 1. Добавьте ключи в JSON:

**en.json:**
```json
{
  "newSection": {
    "title": "New Feature",
    "description": "Description here"
  }
}
```

**ru.json:**
```json
{
  "newSection": {
    "title": "Новая функция",
    "description": "Описание здесь"
  }
}
```

### 2. Используйте в компоненте:

```tsx
const { t } = useI18n();
// ...
<h1>{t('newSection.title')}</h1>
```

## Переведённые страницы ✅

- [x] Header (навигация)
- [x] LoginPage (вход)
- [x] RegisterPage (регистрация)
- [x] Dashboard (личный кабинет)
- [x] Pricing (тарифы)
- [x] HealthModules (модули здоровья)

## Страницы для перевода ⏳

Чтобы перевести оставшиеся страницы:

1. Откройте файл страницы
2. Замените все строки на `t('ключ')`
3. Добавьте недостающие ключи в `en.json` и `ru.json`

### Шаблон для быстрого перевода:

```tsx
// Было:
<h1>Заголовок страницы</h1>
<button>Сохранить</button>

// Стало:
import { useI18n } from '@/i18n';
// ...
const { t } = useI18n();
// ...
<h1>{t('pageName.title')}</h1>
<button>{t('common.save')}</button>
```

## Переключатель языка

Язык переключается через `LanguageSwitcher` компонент в Header. 
Текущий язык сохраняется в localStorage.

## Добавление нового языка

1. Создайте `client/src/i18n/locales/xx.json`
2. Добавьте в `client/src/i18n/index.ts`:
   ```ts
   import xx from './locales/xx.json';
   export const resources = { en, ru, xx };
   ```
3. Обновите LanguageSwitcher для поддержки нового языка
