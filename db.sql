-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jul 23, 2025 at 11:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `user_id` int(11) NOT NULL,
  `st` text NOT NULL,
  `no` int(11) NOT NULL,
  `dist` text NOT NULL,
  `city` int(11) NOT NULL,
  `zip_code` int(11) NOT NULL,
  `country` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`user_id`, `st`, `no`, `dist`, `city`, `zip_code`, `country`, `date`) VALUES
(2, 'ساقية مكي', 10, 'الجيزة، ساقية مكي', 1, 11659, 1, '2025-07-16 21:29:55');

-- --------------------------------------------------------

--
-- Table structure for table `basket`
--

CREATE TABLE `basket` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `basket`
--

INSERT INTO `basket` (`id`, `user_id`, `product_id`, `quantity`, `date`) VALUES
(8, 2, 1, 1, '2025-01-24 00:27:43'),
(15, 2, 1, 1, '2025-01-27 21:31:28'),
(16, 2, 2, 1, '2025-01-27 21:31:35'),
(17, 2, 33, 1, '2025-01-28 15:09:07'),
(22, 2, 1, 1, '2025-01-28 19:08:30'),
(23, 2, 1, 1, '2025-01-29 19:03:28'),
(24, 1, 1, 1, '2025-06-28 16:43:55'),
(25, 2, 1, 2, '2025-07-21 18:30:06'),
(26, 2, 1, 2, '2025-07-21 21:00:04'),
(27, 2, 1, 2, '2025-07-21 23:05:40');

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `user_id` int(11) NOT NULL,
  `name_car` text NOT NULL,
  `mark` int(11) NOT NULL,
  `model` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`user_id`, `name_car`, `mark`, `model`, `date`) VALUES
(2, 'سيارتي', 1, 1, '2025-01-22 14:25:35');

-- --------------------------------------------------------

--
-- Table structure for table `inbox`
--

CREATE TABLE `inbox` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `inbox` text NOT NULL,
  `content` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `inbox`
--

INSERT INTO `inbox` (`id`, `user_id`, `inbox`, `content`, `date`) VALUES
(2, 2, 'نرحب بك في Urensh', 'يسعدنا وجودك معنا في يورينش! إذا احتجت إلى أي مساعدة، يرجى التوجه إلى مركز المساعدة.', '2025-01-03 18:49:19'),
(4, 2, 'إجرائات السلامة', 'يرجى قراءة شروط الاستخدام بعناية قبل شراء أي منتج.\n\n\n\n\n\n\n', '2024-12-30 17:26:10'),
(5, 2, 'تنبيه بوصول المنتج الذي لم يتم استلامه', 'إشعار رسمي بوصول المنتج الذي لم يتم استلامه بعد.', '2025-01-03 18:49:19'),
(6, 2, 'منتجات مميزة لا تفوّت الفرصة للحصول عليها!', 'منتجات مميزة لا تفوّت الفرصة للحصول عليها! اكتشف الآن العروض التي اخترناها خصيصًا لك', '2025-01-03 18:49:19');

-- --------------------------------------------------------

--
-- Table structure for table `keywords`
--

CREATE TABLE `keywords` (
  `id` int(11) NOT NULL,
  `keyword` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `keywords`
--

INSERT INTO `keywords` (`id`, `keyword`) VALUES
(1, 'أنظمة التعليق\n'),
(2, 'بنز فئة C W203 W204\n'),
(3, 'ذراع التحكم لمرسيدس\n');

-- --------------------------------------------------------

--
-- Table structure for table `marks`
--

CREATE TABLE `marks` (
  `id` int(11) NOT NULL,
  `mark` text NOT NULL,
  `logo_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `marks`
--

INSERT INTO `marks` (`id`, `mark`, `logo_id`, `date`) VALUES
(1, 'Mercedes-Benz', 1, '2025-01-19 17:04:31');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `no` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `id_user`, `name`, `no`, `date`) VALUES
(1, 2, 'أساسي', '1000534', '2025-07-16 21:29:24');

-- --------------------------------------------------------

--
-- Table structure for table `models`
--

CREATE TABLE `models` (
  `id` int(11) NOT NULL,
  `mark_id` int(11) NOT NULL,
  `model` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `models`
--

INSERT INTO `models` (`id`, `mark_id`, `model`, `date`) VALUES
(2, 1, 'EQE', '2025-01-19 17:23:17');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `numop` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` float NOT NULL,
  `status` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `product_id`, `user_id`, `numop`, `quantity`, `price`, `status`, `date`) VALUES
(1, 2, 2, 2234, 1, 4129.61, 0, '2025-01-28 15:31:38');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `quantity` int(11) NOT NULL,
  `image` text NOT NULL,
  `price` float NOT NULL,
  `type_id` int(11) NOT NULL,
  `mark` int(11) NOT NULL,
  `model` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `title`, `quantity`, `image`, `price`, `type_id`, `mark`, `model`, `date`) VALUES
(1, 'يد تحكم', 32, '1', 1200.72, 1, 1, 1, '2025-01-26 12:26:38'),
(2, 'مقص أمامي علوي', 8, '2', 4129.61, 1, 1, 1, '2025-01-26 12:30:59'),
(25, 'منتج 2', 5, '1', 1400.4, 1, 1, 1, '2025-01-26 12:19:30'),
(26, 'منتج 3', 5, '1', 1400.4, 1, 1, 1, '2025-01-26 12:19:33'),
(27, 'منتج 4', 5, '1', 1400.4, 1, 1, 1, '2025-01-26 12:19:35'),
(28, 'منتج 5', 5, '1', 1400.4, 1, 1, 1, '2025-01-26 12:19:38'),
(29, 'منتج 6', 5, '1', 1400.4, 1, 1, 1, '2025-01-26 12:19:40'),
(30, 'منتج 7', 5, '1', 1400.4, 1, 1, 1, '2025-01-26 12:19:42'),
(31, 'منتج 8', 5, '1', 1400.4, 1, 1, 1, '2025-01-26 12:19:44'),
(32, 'منتج 100', 1, '1', 2000, 1, 1, 1, '2025-01-27 21:07:53'),
(33, 'منتج 19', 5, '1', 10, 1, 1, 1, '2025-01-28 15:09:00'),
(34, 'فاندام', 80, '1', 74, 1, 1, 1, '2025-01-28 15:39:55');

-- --------------------------------------------------------

--
-- Table structure for table `products_keywords`
--

CREATE TABLE `products_keywords` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `keyword_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `products_keywords`
--

INSERT INTO `products_keywords` (`id`, `product_id`, `keyword_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 2, 1),
(5, 2, 2),
(6, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` decimal(3,2) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `product_id`, `user_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 2, 5.00, 'شكراً', '2025-01-24 18:22:15'),
(2, 2, 1, 3.00, 'ممتاز', '2025-01-24 18:22:15'),
(3, 2, 2, 4.00, 'thanks', '2025-07-16 22:48:22');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `reason` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `saves`
--

CREATE TABLE `saves` (
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `saves`
--

INSERT INTO `saves` (`user_id`, `product_id`, `date`) VALUES
(1, 4, '2025-01-06 03:16:27'),
(5, 1, '2025-01-14 14:24:53'),
(5, 2, '2025-01-14 14:26:37'),
(1, 1, '2025-01-16 11:54:32'),
(1, 3, '2025-01-16 11:54:37'),
(2, 3, '2025-01-17 11:16:51'),
(2, 26, '2025-01-26 19:13:10'),
(2, 33, '2025-01-28 15:09:08'),
(1, 28, '2025-01-28 15:37:36');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` int(11) NOT NULL,
  `name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `image` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `name`, `image`, `date`) VALUES
(1, 'اجزاء فتيس', '1', '2025-07-21 00:01:09'),
(2, 'عفشة', '1', '2025-07-17 15:46:35'),
(3, 'كماليات', '1', '2025-07-17 15:46:35'),
(4, 'اجزاء محرك', '1', '2025-07-21 00:01:21');

-- --------------------------------------------------------

--
-- Table structure for table `types`
--

CREATE TABLE `types` (
  `id` int(11) NOT NULL,
  `id_section` int(11) NOT NULL,
  `type` text NOT NULL,
  `img` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `types`
--

INSERT INTO `types` (`id`, `id_section`, `type`, `img`, `date`) VALUES
(1, 1, 'أيد تحكم', '1', '2025-07-17 15:40:06'),
(2, 1, 'مقصات', '1', '2025-07-17 15:40:14'),
(3, 1, 'عجلات', '1', '2025-07-17 15:40:21'),
(4, 1, 'كرسي', '1', '2025-07-17 15:40:32');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `client_id` varchar(36) NOT NULL,
  `uip` tinyblob NOT NULL,
  `utoken` varchar(32) DEFAULT NULL,
  `uiv` tinyblob NOT NULL,
  `ukey` varchar(64) DEFAULT NULL,
  `validity` tinyblob NOT NULL,
  `level` int(11) NOT NULL,
  `email` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `password` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `image` text CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `last_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `client_id`, `uip`, `utoken`, `uiv`, `ukey`, `validity`, `level`, `email`, `password`, `image`, `name`, `last_date`, `date`) VALUES
(1, '49baba60-d372-433f-b8dd-cc7e85888d35', 0x3139322e3136382e312e3130303a30303030, '866b5d50d20e50c4b99a23f9ff319729', 0x015974a127131a5c49e7c5a55dc58589, '416d5514af010d561245ad67323e4b4d9bf9cc45f7d2ebb2e47861e25d105157', '', 4, 'test@test.com', '$2a$10$cuCgA1eUdlDEhYh.eTkKaub3e5QKs6E6HT85IDcjH3Sga2fWeHqA6', 'test', 'علي محمد', '2025-07-21 00:11:12', '2025-07-21 00:11:12'),
(2, 'cbd0d63f-9007-437a-b604-4b047df26ad0', '', '723ad75039e9f67acb9832407aa7d449', 0x03cf778c9303e88ffda041d3c76c4d8a, 'ff6c1378a565f201734c3413bdc98832d6bd7409950eaa98b91bbf2d2fbcc94d', '', 0, 'abdo@test.com', '$2a$10$cuCgA1eUdlDEhYh.eTkKaub3e5QKs6E6HT85IDcjH3Sga2fWeHqA6', '/', 'عبد الرحمن أحمد', '2025-07-21 23:20:10', '2025-07-21 23:20:10'),
(5, '0', 0x3a3a666666663a3139322e3136382e312e313030, '4dfc0cf13356f63e462a22631641f78c', 0x9da61ad12e0cc6b5a7b624292cbe7f87, 'ac2ec343c902e86354ad2a4411a365639745a145539507823d043e895339408d', '', 0, 'te@test.com', '$2a$10$g42ciG0fYrWfb7Jp0Q22ZeidWPFzZW/WEdYnK5goKeANgDWP8kvyG', NULL, '', '2025-01-18 10:54:25', '2025-01-18 10:54:25'),
(6, '', 0x3a3a666666663a3139322e3136382e312e313030, '6e7e836e01fd9d919c46d3f291c8376a', 0x2d68519abd7c0de401e1ee43d34f990b, 'fd28915863a6196c344193d2128a3822ce1b7b241d5cfc37beac45de27213727', '', 0, 'shhathywsfmhmd00@gmail.com', '$2a$10$pyv/uvftW68cD5W8XnrySeCJAyq/e.6JzI5A9JbiyI8yvduzyHbKe', NULL, 'يوسف محمد', '2025-01-22 17:30:57', '2025-01-22 17:30:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `basket`
--
ALTER TABLE `basket`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inbox`
--
ALTER TABLE `inbox`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `keywords`
--
ALTER TABLE `keywords`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `keyword` (`keyword`);

--
-- Indexes for table `marks`
--
ALTER TABLE `marks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `models`
--
ALTER TABLE `models`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products_keywords`
--
ALTER TABLE `products_keywords`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `basket`
--
ALTER TABLE `basket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `inbox`
--
ALTER TABLE `inbox`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `keywords`
--
ALTER TABLE `keywords`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `marks`
--
ALTER TABLE `marks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `models`
--
ALTER TABLE `models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `products_keywords`
--
ALTER TABLE `products_keywords`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `types`
--
ALTER TABLE `types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
