import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  az: {
    translation: {
      // Sidebar
      "idarePaneli": "İdarə Paneli",
      "analitika": "Analitika",
      "sebeke": "Şəbəkə",
      "cihazlar": "Cihazlar",
      "proqnoz": "Proqnoz",
      "parametrler": "Parametrlər",

      // Header
      "sabahinizyeir": "Sabahınız xeyir",
      "gunortan": "Günortanız xeyir",
      "axsaminiz": "Axşamınız xeyir",

      // Dashboard cards
      "cariIstehlak": "Cari İstehlak",
      "enerjiQenaeti": "Enerji Qənaəti",
      "karbonAzalmasi": "Karbon Azalması",
      "ayliQenaet": "Aylıq Qənaət",

      // Settings sidebar
      "profil": "Profil",
      "bildirisher": "Bildirişlər",
      "enerjiParametrleri": "Enerji Parametrləri",
      "gorunus": "Görünüş",
      "dilVeRegion": "Dil və Region",
      "tehlukesizlik": "Təhlükəsizlik",

      // Settings - Profile
      "profilMelumatlari": "Profil Məlumatları",
      "adSoyad": "Ad Soyad",
      "ePoct": "E-poçt",
      "telefon": "Telefon",
      "unvan": "Ünvan",
      "yaddaSaxla": "Yaddaşa Saxla",
      "saxlanilir": "Saxlanılır...",
      "yaddaSaxlandi": "✓ Yadda saxlandı",
      "xetaBasvVerdi": "✗ Xəta baş verdi",

      // Settings - Notifications
      "bildirisiParametrleri": "Bildiriş Parametrləri",
      "ePochtBildirisleri": "E-poçt bildirişləri",
      "ePochtBildirisleriDesc": "Vacib hadisələr üçün e-poçt al",
      "pikSaatXeberdarligi": "Pik saat xəbərdarlığı",
      "pikSaatXeberdarligiDesc": "Yüksək tarif saatlarından əvvəl xəbərdar et",
      "batareyaXeberdarligi": "Batareya xəbərdarlığı",
      "batareyaXeberdarligiDesc": "Batareya 20%-dən aşağı düşdükdə",
      "heftelikHesabat": "Həftəlik hesabat",
      "heftelikHesabatDesc": "Həftəlik enerji statistikası",
      "sistemXeberdarliqlar": "Sistem xəbərdarlıqları",
      "sistemXeberdarliqlarDesc": "Şəbəkə kəsilməsi və texniki xətalar",

      // Settings - Energy
      "energiIdareetmesi": "Enerji İdarəetməsi",
      "avtomatikOptimallashdirma": "Avtomatik optimallaşdırma",
      "avtomatikOptimallashdirmaDesc": "Enerji istifadəsini AI ilə optimallaşdır",
      "pikSaatlarindenQac": "Pik saatlardan qaç",
      "pikSaatlarindenQacDesc": "Yüksək tarif saatlarında istehlakı azalt",
      "batareyaPrioriteti": "Batareya prioriteti",
      "batareyaPrioritetiDesc": "Şəbəkə əvəzinə batareyadan istifadə et",
      "geceSaatlarindaSarj": "Gecə saatlarında şarj",
      "geceSaatlarindaSarjDesc": "23:00-06:00 arasında batareyaları şarj et",

      // Settings - Appearance
      "animasiyalar": "Animasiyalar",
      "animasiyalarDesc": "İnterfeys animasiyalarını aktiv et",
      "kompaktGoruntuq": "Kompakt görüntü",
      "kompaktGoruntuqDesc": "Daha sıx məlumat göstər",
      "rengSxemi": "Rəng Sxemi",
      "derinOkean": "Dərin Okean",
      "gece": "Gecə",
      "tundYasil": "Tünd Yaşıl",

      // Settings - Language
      "interfeysDili": "İnterfeys Dili",
      "valyuta": "Valyuta",

      // Settings - Security
      "tehlukesizlikTitle": "Təhlükəsizlik",
      "cariSifre": "Cari Şifrə",
      "yeniSifre": "Yeni Şifrə",
      "sifreyiTesdiqle": "Şifrəni Təsdiqlə",
      "sifreyiYenile": "Şifrəni Yenilə",
      "hesabiSil": "Hesabı Sil",
      "hesabiSilDesc": "Bu əməliyyat geri qaytarıla bilməz.",
      "sifrelerUygunDeyil": "✗ Şifrələr uyğun deyil",
      "sifreYenilendi": "✓ Şifrə yeniləndi",
      "sifreEnAz": "✗ Şifrə ən az 6 simvol olmalıdır",
    }
  },
  en: {
    translation: {
      "idarePaneli": "Dashboard",
      "analitika": "Analytics",
      "sebeke": "Grid",
      "cihazlar": "Devices",
      "proqnoz": "Forecast",
      "parametrler": "Settings",

      "sabahinizyeir": "Good morning",
      "gunortan": "Good afternoon",
      "axsaminiz": "Good evening",

      "cariIstehlak": "Current Usage",
      "energiQenaeti": "Energy Savings",
      "karbonAzalmasi": "Carbon Reduction",
      "ayliQenaet": "Monthly Savings",

      "profil": "Profile",
      "bildirisher": "Notifications",
      "energiParametrleri": "Energy Settings",
      "gorunus": "Appearance",
      "dilVeRegion": "Language & Region",
      "tehlukesizlik": "Security",

      "profilMelumatlari": "Profile Information",
      "adSoyad": "Full Name",
      "ePoct": "Email",
      "telefon": "Phone",
      "unvan": "Address",
      "yaddaSaxla": "Save",
      "saxlanilir": "Saving...",
      "yaddaSaxlandi": "✓ Saved",
      "xetaBasvVerdi": "✗ An error occurred",

      "bildirisiParametrleri": "Notification Settings",
      "ePochtBildirisleri": "Email notifications",
      "ePochtBildirisleriDesc": "Receive emails for important events",
      "pikSaatXeberdarligi": "Peak hour alert",
      "pikSaatXeberdarligiDesc": "Alert before high tariff hours",
      "batareyaXeberdarligi": "Battery alert",
      "batareyaXeberdarligiDesc": "When battery drops below 20%",
      "heftelikHesabat": "Weekly report",
      "heftelikHesabatDesc": "Weekly energy statistics",
      "sistemXeberdarliqlar": "System alerts",
      "sistemXeberdarliqlarDesc": "Grid outages and technical errors",

      "energiIdareetmesi": "Energy Management",
      "avtomatikOptimallashdirma": "Auto optimization",
      "avtomatikOptimallashdirmaDesc": "Optimize energy usage with AI",
      "pikSaatlarindenQac": "Avoid peak hours",
      "pikSaatlarindenQacDesc": "Reduce consumption during high tariff hours",
      "batareyaPrioriteti": "Battery priority",
      "batareyaPrioritetiDesc": "Use battery instead of grid",
      "geceSaatlarindaSarj": "Night charging",
      "geceSaatlarindaSarjDesc": "Charge batteries between 23:00-06:00",

      "animasiyalar": "Animations",
      "animasiyalarDesc": "Enable interface animations",
      "kompaktGoruntuq": "Compact view",
      "kompaktGoruntuqDesc": "Show more dense information",
      "rengSxemi": "Color Scheme",
      "derinOkean": "Deep Ocean",
      "gece": "Night",
      "tundYasil": "Dark Green",

      "interfeysDili": "Interface Language",
      "valyuta": "Currency",

      "tehlukesizlikTitle": "Security",
      "cariSifre": "Current Password",
      "yeniSifre": "New Password",
      "sifreyiTesdiqle": "Confirm Password",
      "sifreyiYenile": "Update Password",
      "hesabiSil": "Delete Account",
      "hesabiSilDesc": "This action cannot be undone.",
      "sifrelerUygunDeyil": "✗ Passwords do not match",
      "sifreYenilendi": "✓ Password updated",
      "sifreEnAz": "✗ Password must be at least 6 characters",
    }
  },
  ru: {
    translation: {
      "idarePaneli": "Панель управления",
      "analitika": "Аналитика",
      "sebeke": "Сеть",
      "cihazlar": "Устройства",
      "proqnoz": "Прогноз",
      "parametrler": "Настройки",

      "sabahinizyeir": "Доброе утро",
      "gunortan": "Добрый день",
      "axsaminiz": "Добрый вечер",

      "cariIstehlak": "Текущее потребление",
      "energiQenaeti": "Экономия энергии",
      "karbonAzalmasi": "Снижение CO₂",
      "ayliQenaet": "Ежемесячная экономия",

      "profil": "Профиль",
      "bildirisher": "Уведомления",
      "energiParametrleri": "Параметры энергии",
      "gorunus": "Внешний вид",
      "dilVeRegion": "Язык и регион",
      "tehlukesizlik": "Безопасность",

      "profilMelumatlari": "Данные профиля",
      "adSoyad": "Имя Фамилия",
      "ePoct": "Эл. почта",
      "telefon": "Телефон",
      "unvan": "Адрес",
      "yaddaSaxla": "Сохранить",
      "saxlanilir": "Сохранение...",
      "yaddaSaxlandi": "✓ Сохранено",
      "xetaBasvVerdi": "✗ Произошла ошибка",

      "bildirisiParametrleri": "Настройки уведомлений",
      "ePochtBildirisleri": "Email уведомления",
      "ePochtBildirisleriDesc": "Получать письма о важных событиях",
      "pikSaatXeberdarligi": "Предупреждение о пиковых часах",
      "pikSaatXeberdarligiDesc": "Уведомить перед часами высокого тарифа",
      "batareyaXeberdarligi": "Предупреждение о батарее",
      "batareyaXeberdarligiDesc": "Когда батарея ниже 20%",
      "heftelikHesabat": "Еженедельный отчёт",
      "heftelikHesabatDesc": "Еженедельная статистика энергии",
      "sistemXeberdarliqlar": "Системные предупреждения",
      "sistemXeberdarliqlarDesc": "Отключения сети и технические ошибки",

      "energiIdareetmesi": "Управление энергией",
      "avtomatikOptimallashdirma": "Авто-оптимизация",
      "avtomatikOptimallashdirmaDesc": "Оптимизировать потребление с ИИ",
      "pikSaatlarindenQac": "Избегать пиковых часов",
      "pikSaatlarindenQacDesc": "Снизить потребление в часы высокого тарифа",
      "batareyaPrioriteti": "Приоритет батареи",
      "batareyaPrioritetiDesc": "Использовать батарею вместо сети",
      "geceSaatlarindaSarj": "Ночная зарядка",
      "geceSaatlarindaSarjDesc": "Заряжать батареи с 23:00 до 06:00",

      "animasiyalar": "Анимации",
      "animasiyalarDesc": "Включить анимации интерфейса",
      "kompaktGoruntuq": "Компактный вид",
      "kompaktGoruntuqDesc": "Показывать более плотную информацию",
      "rengSxemi": "Цветовая схема",
      "derinOkean": "Глубокий океан",
      "gece": "Ночь",
      "tundYasil": "Тёмно-зелёный",

      "interfeysDili": "Язык интерфейса",
      "valyuta": "Валюта",

      "tehlukesizlikTitle": "Безопасность",
      "cariSifre": "Текущий пароль",
      "yeniSifre": "Новый пароль",
      "sifreyiTesdiqle": "Подтвердите пароль",
      "sifreyiYenile": "Обновить пароль",
      "hesabiSil": "Удалить аккаунт",
      "hesabiSilDesc": "Это действие нельзя отменить.",
      "sifrelerUygunDeyil": "✗ Пароли не совпадают",
      "sifreYenilendi": "✓ Пароль обновлён",
      "sifreEnAz": "✗ Пароль должен быть не менее 6 символов",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('ecoai_lang') || 'az',
    fallbackLng: 'az',
    interpolation: { escapeValue: false },
  });

export default i18n;