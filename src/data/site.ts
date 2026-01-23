export const siteConfig = {
  brand: {
    name: "SyncJS Yazılım",
  },
  contact: {
    phone: "+90 506 165 93 88",
    phoneHref: "+905061659388",
    email: "admin@tasodigital.com",
    addressLines: [
      "Merkez Mahallesi, Ataturk Caddesi",
      "No:123, Kat:5, Istanbul",
    ],
    workingHours: {
      week: "09:00 - 18:00",
      saturday: "10:00 - 16:00",
      sunday: "Kapali",
    },
  },
  map: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.4647757!2d28.9880843!3d41.0546354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7c5c7b4c0d7%3A0x8e5e5e5e5e5e5e5e!2sEsentepe%20Mah.%20Talatpa%C5%9Fa%20Cad.%20No%3A5%2C%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1600000000000!5m2!1str!2str",
  },
  social: {
    facebook: "https://facebook.com/tasodigital",
    twitter: "https://twitter.com/tasodigital",
    instagram: "https://instagram.com/tasodigital",
    linkedin: "https://linkedin.com/company/tasodigital",
    youtube: "https://youtube.com/@tasodigital",
  },
  productCategories: [
    { id: "web", label: "Web Gelistirme", icon: "fas fa-globe" },
    { id: "commerce", label: "E-Ticaret", icon: "fas fa-store" },
    { id: "marketing", label: "Dijital Pazarlama", icon: "fas fa-bullhorn" },
    { id: "consulting", label: "Danismanlik", icon: "fas fa-user-tie" },
  ],
  products: [
    {
      id: "web-starter",
      title: "Kurumsal Web Sitesi",
      description:
        "Kurumsal kimliginize uygun hizli ve guvenli web sitesi paketi.",
      image:
        "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
      badge: "WEB",
      category: "web",
      price: "Baslangic 19.900 TL",
      priceAmount: 19900,
      pricingType: "paid",
      highlight: true,
      features: [
        { label: "Responsive tasarim ve modern UI", type: "included" },
        { label: "Icerik yonetim paneli", type: "included" },
        { label: "Blog ve haber modulu", type: "included" },
        { label: "Bakim ve destek (12 ay)", type: "premium" },
      ],
      extras: [
        {
          id: "seo-basic",
          title: "SEO Baslangic",
          description: "Anahtar kelime analizi ve temel optimizasyon",
          price: "3.500 TL",
          priceAmount: 3500,
          type: "optional",
        },
        {
          id: "hosting",
          title: "Yillik Hosting",
          description: "SSD altyapi uzerinde sinirsiz trafik",
          price: "1.200 TL",
          priceAmount: 1200,
          type: "optional",
        },
      ],
      ctaLabel: "Detayli Bilgi",
      ctaHref: "/iletisim",
    },
    {
      id: "commerce-pro",
      title: "E-Ticaret Platformu",
      description:
        "Urun katalogu, odeme entegrasyonu ve kargo takip modulleri ile hazir paket.",
      image:
        "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1200&q=80",
      badge: "SHOP",
      category: "commerce",
      price: "Baslangic 39.900 TL",
      priceAmount: 39900,
      pricingType: "paid",
      features: [
        { label: "Tum banka sanal pos entegrasyonu", type: "included" },
        { label: "Stok ve siparis otomasyonu", type: "included" },
        { label: "Pazaryeri entegrasyonu", type: "premium" },
        { label: "Pazarlama otomasyonu", type: "premium" },
      ],
      extras: [
        {
          id: "erp",
          title: "ERP Entegrasyonu",
          description: "Mevcut ERP sisteminizle stok senkronizasyonu",
          price: "6.500 TL",
          priceAmount: 6500,
          type: "optional",
        },
        {
          id: "loyalty",
          title: "Sadakat Programi",
          description: "Puan ve kupon yonetimi",
          price: "Aylik 950 TL",
          priceAmount: 950,
          type: "subscription",
        },
      ],
      ctaLabel: "Demo Talep Et",
      ctaHref: "/iletisim",
    },
    {
      id: "marketing-suite",
      title: "Dijital Pazarlama Paketi",
      description:
        "Sosyal medya yonetimi, reklam kampanyalari ve aylik raporlama hizmeti.",
      image:
        "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80",
      badge: "ADS",
      category: "marketing",
      price: "Aylik 12.500 TL",
      priceAmount: 12500,
      pricingType: "paid",
      features: [
        { label: "4 sosyal medya kanali", type: "included" },
        { label: "Reklam yonetimi (Meta & Google)", type: "included" },
        { label: "Aylik performans raporu", type: "included" },
        { label: "Influencer kampanya planlama", type: "premium" },
      ],
      extras: [
        {
          id: "studio",
          title: "Stok Icerik Cekimi",
          description: "Aylik profesyonel fotograf ve video cekimi",
          price: "4.750 TL",
          priceAmount: 4750,
          type: "subscription",
        },
        {
          id: "crm",
          title: "CRM Entegrasyonu",
          description: "Musteri yolculugu ve otomasyon senaryolari",
          price: "5.900 TL",
          priceAmount: 5900,
          type: "optional",
        },
      ],
      ctaLabel: "Kampanya Baslat",
      ctaHref: "/iletisim",
    },
    {
      id: "consulting-starter",
      title: "Strateji Danismanligi",
      description:
        "Haftalik oturumlarla dijital buyume stratejisi olusturma ve uygulama destegi.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      badge: "XP",
      category: "consulting",
      price: "Ucretsiz ilk oturum",
      priceAmount: 0,
      pricingType: "free",
      features: [
        { label: "Baslangic analizi ve yol haritasi", type: "included" },
        { label: "Haftalik 1 saatlik oturum", type: "included" },
        { label: "Rakip analizi raporu", type: "premium" },
        { label: "A/B test ve optimizasyon", type: "premium" },
      ],
      extras: [
        {
          id: "scale-plan",
          title: "Scale Plan",
          description: "Aylik 4 saat ek danismanlik",
          price: "Aylik 6.000 TL",
          priceAmount: 6000,
          type: "subscription",
        },
        {
          id: "analytics",
          title: "Analytics Kurulumu",
          description: "GTM, GA4 ve dashboard kurulumu",
          price: "3.200 TL",
          priceAmount: 3200,
          type: "optional",
        },
      ],
      ctaLabel: "Ucretsiz Randevu Al",
      ctaHref: "/iletisim",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
