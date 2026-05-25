-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 31, 2025 at 01:21 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lulas_pastry`
--

DELIMITER $$
--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `generate_order_number` () RETURNS VARCHAR(20) CHARSET utf8mb4 COLLATE utf8mb4_general_ci  BEGIN
    DECLARE new_order_number VARCHAR(20);
    SET new_order_number = CONCAT('ORD-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0'));
    RETURN new_order_number;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `dish_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `dish_id`, `quantity`, `added_at`) VALUES
(19, 5, 8, 2, '2025-12-31 11:14:11'),
(22, 9, 5, 1, '2025-12-31 12:08:45');

-- --------------------------------------------------------

--
-- Table structure for table `delivery`
--

CREATE TABLE `delivery` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `delivery_type` enum('pickup','delivery') DEFAULT 'delivery',
  `delivery_address` text DEFAULT NULL,
  `delivery_fee` decimal(10,2) DEFAULT 0.00,
  `assigned_chef_id` int(11) DEFAULT NULL,
  `baking_start_time` datetime DEFAULT NULL,
  `baking_end_time` datetime DEFAULT NULL,
  `estimated_delivery_time` datetime DEFAULT NULL,
  `actual_delivery_time` datetime DEFAULT NULL,
  `delivery_status` enum('scheduled','baking','on_way','delivered') DEFAULT 'scheduled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dishes`
--

CREATE TABLE `dishes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) DEFAULT 'pastry',
  `image_url` varchar(255) DEFAULT NULL,
  `available` tinyint(1) DEFAULT 1,
  `ingredients` text DEFAULT NULL,
  `preparation_time` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `chef_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dishes`
--

INSERT INTO `dishes` (`id`, `name`, `description`, `price`, `category`, `image_url`, `available`, `ingredients`, `preparation_time`, `created_at`, `chef_id`) VALUES
(1, 'Croissant', 'Freshly baked French croissant', 15.00, 'bread', 'asssets/products/croissant.jpeg', 1, 'Flour, Butter, Yeast, Sugar', 120, '2025-12-24 18:59:58', 1),
(2, 'Chocolate Cake', 'Rich chocolate cake with ganache', 80.00, 'cake', 'asssets/products/chocolate_cake.jpeg', 1, 'Chocolate, Flour, Eggs, Sugar, Cream', 180, '2025-12-24 18:59:58', 2),
(3, 'Apple Pie', 'Traditional apple pie with cinnamon', 45.00, 'pie', 'asssets/products/apple_pie.jpeg', 1, 'Apples, Cinnamon, Flour, Sugar, Butter', 150, '2025-12-24 18:59:58', 1),
(4, 'Blueberry Muffins', 'Fresh muffins with blueberries', 25.00, 'muffin', 'asssets/products/muffin.jpeg', 1, 'Flour, Blueberries, Eggs, Milk, Sugar', 90, '2025-12-24 18:59:58', 2),
(5, 'Cheese Danish', 'Cream cheese filled pastry', 20.00, 'pastry', 'asssets/products/danish.jpeg', 1, 'Flour, Cream Cheese, Butter, Sugar', 100, '2025-12-24 18:59:58', 1),
(8, 'Vanilla Cake', 'Vanilla white cake', 60.00, 'cake', 'uploads/dish_1767179571_1152.jpeg', 1, NULL, NULL, '2025-12-31 11:12:51', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_number` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','rejected','preparing','baking','ready','delivered','cancelled') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('pending','paid','failed') DEFAULT 'pending',
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `delivery_date` datetime DEFAULT NULL,
  `special_instructions` text DEFAULT NULL,
  `delivery_address` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(30) DEFAULT NULL,
  `delivery_cost` decimal(10,2) NOT NULL DEFAULT 4.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `user_id`, `total_amount`, `status`, `payment_method`, `payment_status`, `order_date`, `delivery_date`, `special_instructions`, `delivery_address`, `customer_phone`, `delivery_cost`) VALUES
(1, 'ORD-1766832223', 5, 180.00, 'pending', NULL, 'pending', '2025-12-27 10:43:43', NULL, '', NULL, NULL, 4.00),
(2, 'ORD-1766832259', 5, 40.00, 'pending', NULL, 'pending', '2025-12-27 10:44:19', NULL, '', NULL, NULL, 4.00),
(3, 'ORD1766833507', 5, 45.00, 'confirmed', 'cash', 'pending', '2025-12-27 11:05:07', '2025-12-30 00:00:00', 'add extra pistachio', NULL, NULL, 4.00),
(4, 'ORD1766833827', 5, 20.00, 'confirmed', 'cash', 'pending', '2025-12-27 11:10:27', '2025-12-30 00:00:00', 'extra pistachio', NULL, NULL, 4.00),
(5, '', 5, 24.00, 'pending', 'cash', 'pending', '2025-12-27 13:52:14', '2026-02-01 00:00:00', 'extra nuts', 'baalback', '76123404', 4.00),
(9, 'ORD-1766845741-177', 5, 164.00, 'confirmed', 'card', 'pending', '2025-12-27 14:29:01', '2026-08-02 00:00:00', 'extra sweet', 'baalback', '76123404', 4.00),
(11, 'ORD-1767182827-531', 6, 64.00, 'pending', 'cash', 'pending', '2025-12-31 12:07:07', '2026-01-01 00:00:00', 'extra white chocloate', 'baalback', '76123404', 4.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `dish_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_time` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `dish_id`, `quantity`, `price_at_time`) VALUES
(1, 1, 2, 2, 80.00),
(2, 1, 5, 1, 20.00),
(3, 2, 5, 2, 20.00),
(4, 3, 3, 1, 45.00),
(5, 4, 5, 1, 20.00),
(8, 9, 2, 2, 80.00),
(10, 11, 8, 1, 60.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` enum('admin','chef','customer') DEFAULT 'customer',
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `user_type`, `full_name`, `phone`, `address`, `created_at`) VALUES
(1, 'chef_ahmed', 'ahmed@lulas.com', '12345', 'chef', 'Ahmed Hassan', '01012345678', NULL, '2025-12-24 18:59:58'),
(2, 'chef_mariam', 'mariam@lulas.com', '$2y$10$YourHashedPasswordHere', 'chef', 'Mariam Ali', '01087654321', NULL, '2025-12-24 18:59:58'),
(3, 'customer1', 'customer1@example.com', '$2y$10$YourHashedPasswordHere', 'customer', 'John Doe', '01011112222', NULL, '2025-12-24 18:59:58'),
(4, 'customer2', 'customer2@example.com', '$2y$10$YourHashedPasswordHere', 'customer', 'Jane Smith', '01033334444', NULL, '2025-12-24 18:59:58'),
(5, 'testcustomer', 'test@example.com', 'test123', 'customer', 'Test Customer', NULL, NULL, '2025-12-24 19:51:14'),
(6, 'Hiba', 'hibahussieni@gmail.com', '$2y$10$4QY98.2l5ZMbcC6bsd0lyegNO4hCfs7S5AIt0eTPGP8Fl9i3TLH6C', 'customer', 'Hiba', NULL, NULL, '2025-12-31 09:55:59'),
(7, 'Haidar', 'Haidar@gmail.com', '$2y$10$FhmGwkmNejq2WBeKWGlCG.aWA70ArPVyHXMswRh2K/qyPgifU6a46', 'customer', 'Haidar', NULL, NULL, '2025-12-31 10:00:20'),
(9, 'Banine', 'Banine@gmail.com', '$2y$10$k9RjPmP8.xu44QKzPXmFYuzvM53dYI1tN0VoMvmSK.UZLZ5fYlyi2', 'customer', 'Banine', NULL, NULL, '2025-12-31 12:07:59'),
(10, 'lula_admin', 'lula@lulaspastry.com', '$2b$10$aPTdl7gN8N3IulwXbl5d2eT3ZbdUwoAUlLNzrt.qAepXJHc4ht0dq', 'admin', 'Lula Admin', NULL, NULL, '2026-05-23 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart_item` (`user_id`,`dish_id`),
  ADD KEY `dish_id` (`dish_id`);

--
-- Indexes for table `delivery`
--
ALTER TABLE `delivery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `assigned_chef_id` (`assigned_chef_id`);

--
-- Indexes for table `dishes`
--
ALTER TABLE `dishes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chef_id` (`chef_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `dish_id` (`dish_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD UNIQUE KEY `unique_username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `delivery`
--
ALTER TABLE `delivery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dishes`
--
ALTER TABLE `dishes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `delivery`
--
ALTER TABLE `delivery`
  ADD CONSTRAINT `delivery_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `delivery_ibfk_2` FOREIGN KEY (`assigned_chef_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `dishes`
--
ALTER TABLE `dishes`
  ADD CONSTRAINT `dishes_ibfk_1` FOREIGN KEY (`chef_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
