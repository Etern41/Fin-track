/**
 * Лимиты в духе обычных веб‑приложений и стандартов (RFC, ограничения bcrypt).
 */

/** Заметка к операции: в продуктах часто 255–500+ символов; 500 без «простыней» на мегабайты. */
export const MAX_TRANSACTION_DESCRIPTION_LENGTH = 500;

/** Поиск по описанию — как типичное поле «ключевые слова» (часто до 255). */
export const MAX_SEARCH_QUERY_LENGTH = 255;

/**
 * Верхняя граница суммы (₽) для личного трекера.
 * Не платёжный лимит банка, а защита от мусора и перегруза float.
 */
export const MAX_TRANSACTION_AMOUNT = 999_999_999.99;

/** RFC 5321 (путь в SMTP ≤ 256 символов с угловыми скобками → email до 254). */
export const MAX_EMAIL_LENGTH = 254;

/**
 * bcrypt учитывает не более 72 байт в пароле; длиннее пароль тихо обрезается при хеше.
 * Лимит 72 — обычная практика при bcrypt (см. документацию bcrypt / OWASP).
 */
export const MAX_PASSWORD_LENGTH = 72;

export const MIN_PASSWORD_LENGTH = 8;

/** Имя в профиле — как во многих сервисах (десятки символов, не абзац). */
export const MAX_USER_NAME_LENGTH = 64;

/** Строка «категория» до проверки по whitelist; сами категории короткие. */
export const MAX_CATEGORY_INPUT_LENGTH = 64;
