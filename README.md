# FocusFlow - AI Destekli Görev ve Odaklanma Asistanı

Modern, **dark mode** odaklı, glassmorphism efektli görev yönetimi ve Pomodoro uygulaması.

## Özellikler
- **Kanban Board** — Sürükle-bırak ile Yapılacaklar / Yapılıyor / Tamamlandı
- **Öncelik etiketleri** (Düşük, Orta, Yüksek)
- **Pomodoro Sayacı** (25 dk çalışma / 5 dk mola) + tarayıcı bildirimi + ses
- **Lo-Fi / Yağmur sesi** widget’ı
- **AI Performans Koçu** (mock, gerçek API’ye hazır)
- `localStorage` ile veri kalıcılığı
- Tam responsive (mobil + masaüstü)
- Neon mavi (#00d2ff) + derin gece mavisi (#0b111e) tema

## Kurulum
```bash
git clone https://github.com/yusufgunbay53-ux/focusflow-modern.git
cd focusflow-modern
npm install
npm run dev
```

Tarayıcıda açın: **http://localhost:3000**

## Tech Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS**
- **@dnd-kit** (Drag & Drop)
- **Lucide React** (ikonlar)
- localStorage (gelecekte Supabase/Firebase için hazır modüler yapı)

## Gelecek Geliştirmeler
- Gerçek AI API entegrasyonu (OpenAI / Gemini)
- Supabase / Firebase backend
- PWA manifest + offline support
- Daha gelişmiş istatistikler

Keyifli odaklanmalar! 🚀
