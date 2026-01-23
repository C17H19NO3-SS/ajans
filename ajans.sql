-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost
-- Üretim Zamanı: 11 Eki 2025, 13:16:40
-- Sunucu sürümü: 10.11.10-MariaDB-log
-- PHP Sürümü: 8.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `ajans`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `categories`
--

CREATE TABLE `categories` (
  `id` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Tablo döküm verisi `categories`
--

INSERT INTO `categories` (`id`, `title`, `description`, `icon`, `created_at`, `updated_at`) VALUES
('consulting', 'Danismanlik', 'Strateji ve danismanlik hizmetleri', 'fas fa-user-tie', '2025-09-27 22:54:32', '2025-09-27 22:54:32'),
('marketing', 'Pazarlama', 'Dijital pazarlama ve SEO hizmetleri', 'fas fa-bullhorn', '2025-09-27 22:54:32', '2025-09-27 22:54:32'),
('mobile', 'Mobil', 'Mobil uygulama ve deneyimleri', 'fas fa-mobile-alt', '2025-09-27 22:54:32', '2025-09-27 22:54:32'),
('other', 'Diger', 'Diger urun ve hizmetler', 'fas fa-th-large', '2025-09-27 22:54:32', '2025-09-27 22:54:32'),
('web', 'Web', 'Web uygulamalari ve site projeleri', 'fas fa-globe', '2025-09-27 22:54:32', '2025-09-27 22:54:32');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `category_translations`
--

CREATE TABLE `category_translations` (
  `category_id` varchar(64) NOT NULL,
  `locale` varchar(8) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Tablo döküm verisi `category_translations`
--

INSERT INTO `category_translations` (`category_id`, `locale`, `title`, `description`) VALUES
('consulting', 'en', 'Consulting', 'Strategy and consulting services'),
('consulting', 'tr', 'Danismanlik', 'Strateji ve danismanlik hizmetleri'),
('marketing', 'en', 'Marketing', 'Digital marketing and SEO services'),
('marketing', 'tr', 'Pazarlama', 'Dijital pazarlama ve SEO hizmetleri'),
('mobile', 'en', 'Mobile', 'Mobile applications and experiences'),
('mobile', 'tr', 'Mobil', 'Mobil uygulama ve deneyimleri'),
('other', 'en', 'Other', 'Other products and services'),
('other', 'tr', 'Diger', 'Diger urun ve hizmetler'),
('web', 'en', 'Web', 'Web applications and site projects'),
('web', 'tr', 'Web', 'Web uygulamalari ve site projeleri');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `locales`
--

CREATE TABLE `locales` (
  `code` varchar(8) NOT NULL,
  `name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Tablo döküm verisi `locales`
--

INSERT INTO `locales` (`code`, `name`) VALUES
('en', 'English'),
('tr', 'Turkish');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `products`
--

CREATE TABLE `products` (
  `id` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(1024) DEFAULT NULL,
  `image_en` varchar(1024) DEFAULT NULL,
  `badge` varchar(64) DEFAULT NULL,
  `href` varchar(1024) DEFAULT NULL,
  `category_id` varchar(64) NOT NULL,
  `price` varchar(64) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Tablo döküm verisi `products`
--

INSERT INTO `products` (`id`, `title`, `description`, `image`, `image_en`, `badge`, `href`, `category_id`, `price`, `created_at`, `updated_at`) VALUES
('p1', 'Kurumsal Web Sitesi', 'Hizli, SEO uyumlu ve mobil duyari kurumsal site paketi.', 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1200&q=60', NULL, 'WEB', '#', 'web', 'TRY 19.990+', '2025-09-27 22:54:32', '2025-09-27 22:54:32'),
('p2', 'E-Ticaret Cozumu', 'Entegre odeme, urun yonetimi ve kargo modulleri.', 'https://images.unsplash.com/photo-1516264664734-8e99fd6f2b78?auto=format&fit=crop&w=1200&q=60', NULL, 'WEB', '#', 'web', 'TRY 39.990+', '2025-09-27 22:54:32', '2025-09-27 22:54:32'),
('p3', 'Mobil Uygulama Baslangic', 'iOS/Android icin React Native baslangic paketi.', 'https://images.unsplash.com/photo-1512499617640-c2f999098c51?auto=format&fit=crop&w=1200&q=60', NULL, 'MOBILE', '#', 'mobile', 'TRY 49.990+', '2025-09-27 22:54:32', '2025-09-27 22:54:32'),
('p4', 'SEO Optimizasyonu', 'Teknik SEO, icerik plani ve backlink stratejisi.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=60', NULL, 'SEO', '#', 'marketing', 'TRY 9.990/ay', '2025-09-27 22:54:32', '2025-09-27 22:54:32'),
('p5', 'Dijital Pazarlama Danismanligi', 'Buyume stratejisi, reklam optimizasyonu ve raporlama.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=60', NULL, 'CONSULT', '#', 'consulting', 'TRY 2.500/saat', '2025-09-27 22:54:32', '2025-09-27 22:54:32');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `product_options`
--

CREATE TABLE `product_options` (
  `id` varchar(64) NOT NULL,
  `product_id` varchar(64) NOT NULL,
  `code` varchar(64) DEFAULT NULL,
  `type` enum('addon','subscription') NOT NULL DEFAULT 'addon',
  `is_required` tinyint(1) NOT NULL DEFAULT 0,
  `is_recurring` tinyint(1) NOT NULL DEFAULT 0,
  `price_amount` int(11) NOT NULL DEFAULT 0,
  `currency` varchar(8) NOT NULL DEFAULT 'TRY',
  `billing_period` enum('month','year') DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 100,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Tablo döküm verisi `product_options`
--

INSERT INTO `product_options` (`id`, `product_id`, `code`, `type`, `is_required`, `is_recurring`, `price_amount`, `currency`, `billing_period`, `sort_order`, `active`, `created_at`, `updated_at`) VALUES
('opt_p1_blog', 'p1', 'blog', 'addon', 0, 0, 4990, 'TRY', NULL, 20, 1, '2025-09-27 22:54:32', '2025-09-27 22:54:32'),
('opt_p1_seo', 'p1', 'seo', 'subscription', 0, 1, 9990, 'TRY', 'month', 30, 1, '2025-09-27 22:54:32', '2025-09-27 22:54:32'),
('opt_p1_ssl', 'p1', 'ssl', 'addon', 0, 1, 0, 'TRY', 'year', 10, 1, '2025-09-27 22:54:32', '2025-09-27 22:54:32');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `product_option_translations`
--

CREATE TABLE `product_option_translations` (
  `option_id` varchar(64) NOT NULL,
  `locale` varchar(8) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price_label` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Tablo döküm verisi `product_option_translations`
--

INSERT INTO `product_option_translations` (`option_id`, `locale`, `title`, `description`, `price_label`) VALUES
('opt_p1_blog', 'en', 'Blog Module', 'Full blog with content templates', 'TRY 4,990'),
('opt_p1_blog', 'tr', 'Blog Modülü', 'Kapsamlı blog ve içerik şablonları', 'TRY 4.990'),
('opt_p1_seo', 'en', 'Monthly SEO', 'Technical SEO and content plan', 'TRY 9,990/mo'),
('opt_p1_seo', 'tr', 'Aylık SEO', 'Teknik SEO ve içerik planı', 'TRY 9.990/ay'),
('opt_p1_ssl', 'en', 'Free SSL', 'Auto-renew yearly SSL certificate', 'Free'),
('opt_p1_ssl', 'tr', 'Ücretsiz SSL', 'Yıllık otomatik yenilemeli SSL sertifikası', 'Ücretsiz');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `product_translations`
--

CREATE TABLE `product_translations` (
  `product_id` varchar(64) NOT NULL,
  `locale` varchar(8) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `badge` varchar(64) DEFAULT NULL,
  `price` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Tablo döküm verisi `product_translations`
--

INSERT INTO `product_translations` (`product_id`, `locale`, `title`, `description`, `image`, `badge`, `price`) VALUES
('p1', 'en', 'Corporate Website', 'Fast, SEO-friendly, responsive corporate site package.', NULL, 'WEB', 'TRY 19.990+'),
('p1', 'tr', 'Kurumsal Web Sitesi', 'Hizli, SEO uyumlu ve mobil duyari kurumsal site paketi.', NULL, 'WEB', 'TRY 19.990+'),
('p2', 'en', 'E-commerce Solution', 'Integrated payments, product management, and shipping modules.', NULL, 'WEB', 'TRY 39.990+'),
('p2', 'tr', 'E-Ticaret Cozumu', 'Entegre odeme, urun yonetimi ve kargo modulleri.', NULL, 'WEB', 'TRY 39.990+'),
('p3', 'en', 'Mobile App Starter', 'React Native starter package for iOS and Android.', NULL, 'MOBILE', 'TRY 49.990+'),
('p3', 'tr', 'Mobil Uygulama Baslangic', 'iOS/Android icin React Native baslangic paketi.', NULL, 'MOBILE', 'TRY 49.990+'),
('p4', 'en', 'SEO Optimization', 'Technical SEO, content planning, and backlink strategy.', NULL, 'SEO', 'TRY 9.990/month'),
('p4', 'tr', 'SEO Optimizasyonu', 'Teknik SEO, icerik plani ve backlink stratejisi.', NULL, 'SEO', 'TRY 9.990/ay'),
('p5', 'en', 'Digital Marketing Consulting', 'Growth strategy, ad optimization, and reporting.', NULL, 'CONSULT', 'TRY 2.500/hour'),
('p5', 'tr', 'Dijital Pazarlama Danismanligi', 'Buyume stratejisi, reklam optimizasyonu ve raporlama.', NULL, 'CONSULT', 'TRY 2.500/saat');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `purchases`
--

CREATE TABLE `purchases` (
  `id` varchar(64) NOT NULL,
  `userId` varchar(64) NOT NULL,
  `orderNumber` varchar(64) NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'pending',
  `totalAmount` int(11) NOT NULL DEFAULT 0,
  `currency` varchar(8) NOT NULL DEFAULT 'TRY',
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `purchase_items`
--

CREATE TABLE `purchase_items` (
  `id` varchar(64) NOT NULL,
  `purchaseId` varchar(64) NOT NULL,
  `productId` varchar(64) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unitPrice` int(11) NOT NULL DEFAULT 0,
  `currency` varchar(8) NOT NULL DEFAULT 'TRY',
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `purchase_statuses`
--

CREATE TABLE `purchase_statuses` (
  `code` varchar(32) NOT NULL,
  `label` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Tablo döküm verisi `purchase_statuses`
--

INSERT INTO `purchase_statuses` (`code`, `label`) VALUES
('cancelled', 'İptal Edildi'),
('completed', 'Tamamlandı'),
('pending', 'Beklemede'),
('processing', 'Hazırlanıyor'),
('refunded', 'İade Edildi');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` varchar(64) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `firstName`, `lastName`, `company`, `phone`, `position`, `passwordHash`, `createdAt`) VALUES
('e4889cbbc60d9c13', 'admin@tasodigital.com', 'admin', 'vehbi taha', 'edis', 'SyncJS', '05528311574', 'Kurucu', '$2a$12$JrnwyLtM6bI/EeM4gs4aPeb1oEhpaWFg2q1YvDzvDSRbkD.E6gk.C', '2025-09-28 00:34:01');

-- --------------------------------------------------------

--
-- Görünüm yapısı durumu `v_purchase_totals`
-- (Asıl görünüm için aşağıya bakın)
--
CREATE TABLE `v_purchase_totals` (
`id` varchar(64)
,`userId` varchar(64)
,`orderNumber` varchar(64)
,`status` varchar(32)
,`totalAmount` int(11)
,`currency` varchar(8)
,`createdAt` datetime
,`updatedAt` datetime
,`calculatedTotal` decimal(42,0)
);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `category_translations`
--
ALTER TABLE `category_translations`
  ADD PRIMARY KEY (`category_id`,`locale`),
  ADD KEY `fk_ct_loc` (`locale`);

--
-- Tablo için indeksler `locales`
--
ALTER TABLE `locales`
  ADD PRIMARY KEY (`code`);

--
-- Tablo için indeksler `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_title` (`title`);

--
-- Tablo için indeksler `product_options`
--
ALTER TABLE `product_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_options_product` (`product_id`);

--
-- Tablo için indeksler `product_option_translations`
--
ALTER TABLE `product_option_translations`
  ADD PRIMARY KEY (`option_id`,`locale`),
  ADD KEY `idx_product_option_tr_locale` (`locale`);

--
-- Tablo için indeksler `product_translations`
--
ALTER TABLE `product_translations`
  ADD PRIMARY KEY (`product_id`,`locale`),
  ADD KEY `idx_product_translations_locale` (`locale`);
ALTER TABLE `product_translations` ADD FULLTEXT KEY `ft_product_tr` (`title`,`description`);

--
-- Tablo için indeksler `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderNumber` (`orderNumber`),
  ADD KEY `fk_pu_status` (`status`),
  ADD KEY `idx_purchases_user` (`userId`,`createdAt` DESC);

--
-- Tablo için indeksler `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_purchase_items_purchase` (`purchaseId`,`sortOrder`);

--
-- Tablo için indeksler `purchase_statuses`
--
ALTER TABLE `purchase_statuses`
  ADD PRIMARY KEY (`code`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

-- --------------------------------------------------------

--
-- Görünüm yapısı `v_purchase_totals`
--
DROP TABLE IF EXISTS `v_purchase_totals`;

CREATE ALGORITHM=UNDEFINED DEFINER=`ajans`@`localhost` SQL SECURITY DEFINER VIEW `v_purchase_totals`  AS SELECT `p`.`id` AS `id`, `p`.`userId` AS `userId`, `p`.`orderNumber` AS `orderNumber`, `p`.`status` AS `status`, `p`.`totalAmount` AS `totalAmount`, `p`.`currency` AS `currency`, `p`.`createdAt` AS `createdAt`, `p`.`updatedAt` AS `updatedAt`, coalesce(sum(`i`.`quantity` * `i`.`unitPrice`),0) AS `calculatedTotal` FROM (`purchases` `p` left join `purchase_items` `i` on(`i`.`purchaseId` = `p`.`id`)) GROUP BY `p`.`id` ;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `category_translations`
--
ALTER TABLE `category_translations`
  ADD CONSTRAINT `fk_ct_cat` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ct_loc` FOREIGN KEY (`locale`) REFERENCES `locales` (`code`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_p_cat` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `product_options`
--
ALTER TABLE `product_options`
  ADD CONSTRAINT `fk_po_p` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `product_option_translations`
--
ALTER TABLE `product_option_translations`
  ADD CONSTRAINT `fk_pot_l` FOREIGN KEY (`locale`) REFERENCES `locales` (`code`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pot_po` FOREIGN KEY (`option_id`) REFERENCES `product_options` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `product_translations`
--
ALTER TABLE `product_translations`
  ADD CONSTRAINT `fk_pt_l` FOREIGN KEY (`locale`) REFERENCES `locales` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pt_p` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `fk_pu_status` FOREIGN KEY (`status`) REFERENCES `purchase_statuses` (`code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pu_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD CONSTRAINT `fk_pi_purchase` FOREIGN KEY (`purchaseId`) REFERENCES `purchases` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
