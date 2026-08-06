-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2026 at 02:13 PM
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
-- Database: `it_helpdesk`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `created_at`) VALUES
(1, 1, 'User logged in', '2026-07-28 21:50:29'),
(2, 1, 'User logged in', '2026-07-29 14:19:09'),
(3, 1, 'User logged in', '2026-07-29 14:40:25'),
(4, 1, 'User logged in', '2026-07-29 14:42:14'),
(5, 1, 'User logged in', '2026-07-29 15:18:02'),
(6, 1, 'User logged in', '2026-07-30 11:17:00'),
(7, 1, 'Created ticket TKT-2026-5C3C40', '2026-07-30 11:17:41'),
(8, 1, 'Updated ticket #8', '2026-07-30 11:45:06'),
(9, 1, 'Updated ticket #8', '2026-07-30 11:45:10'),
(10, 1, 'Created ticket TKT-2026-17B8AE', '2026-07-30 11:45:37'),
(11, 1, 'Created ticket TKT-2026-1AB78C', '2026-07-30 11:51:29'),
(12, 1, 'User logged in', '2026-07-30 11:52:39'),
(13, 1, 'Created ticket TKT-2026-CF200A', '2026-07-30 11:53:00'),
(14, 1, 'Created ticket TKT-2026-471C62', '2026-07-30 11:58:44'),
(15, 1, 'User logged in', '2026-07-31 18:09:17'),
(16, 1, 'Created ticket TKT-2026-724A69', '2026-07-31 18:09:59'),
(17, 1, 'Deleted ticket #13', '2026-07-31 18:16:53'),
(18, 1, 'Deleted ticket #12', '2026-07-31 18:16:56'),
(19, 1, 'Deleted ticket #11', '2026-07-31 18:17:00'),
(20, 1, 'Deleted ticket #10', '2026-07-31 18:17:02'),
(21, 1, 'Deleted ticket #9', '2026-07-31 18:17:06'),
(22, 1, 'Deleted ticket #8', '2026-07-31 18:17:08'),
(23, 1, 'Deleted ticket #7', '2026-07-31 18:17:10'),
(24, 1, 'Deleted ticket #6', '2026-07-31 18:17:12'),
(25, 1, 'Deleted ticket #4', '2026-07-31 18:17:14'),
(26, 1, 'Deleted ticket #3', '2026-07-31 18:17:16'),
(27, 1, 'Deleted ticket #2', '2026-07-31 18:17:18'),
(28, 1, 'Created ticket TKT-2026-ECE5D5', '2026-07-31 18:17:50'),
(29, 1, 'Created ticket TKT-2026-6A25C9', '2026-07-31 18:19:18'),
(30, 1, 'Created ticket TKT-2026-B7391F', '2026-07-31 18:19:55'),
(31, 1, 'User logged in', '2026-07-31 18:20:58'),
(32, 1, 'User logged in', '2026-08-03 13:56:44'),
(33, 1, 'User logged in', '2026-08-03 13:59:01'),
(34, 1, 'User logged in', '2026-08-03 14:01:27'),
(35, 1, 'Created ticket TKT-2026-969974', '2026-08-03 14:04:09'),
(36, 1, 'Created ticket TKT-2026-CC0435', '2026-08-03 14:05:48'),
(37, 1, 'Created ticket TKT-2026-994DBF', '2026-08-03 14:07:05'),
(38, 1, 'Created ticket TKT-2026-944DD3', '2026-08-03 14:23:37'),
(39, 1, 'Created ticket TKT-2026-EC5CFE', '2026-08-03 14:24:30'),
(40, 1, 'User logged in', '2026-08-03 15:11:06'),
(41, 1, 'User logged in', '2026-08-04 10:11:38'),
(42, 1, 'Updated ticket #21', '2026-08-04 10:12:36'),
(43, 1, 'Updated ticket #20', '2026-08-04 10:12:43'),
(44, 1, 'User logged in', '2026-08-05 11:17:20'),
(45, 1, 'User logged in', '2026-08-05 17:50:01'),
(46, 1, 'Created ticket TKT-2026-FA017A', '2026-08-05 18:01:19'),
(47, 1, 'Updated ticket #22', '2026-08-05 18:02:00'),
(48, 1, 'User logged in', '2026-08-05 19:02:32'),
(49, 2, 'User logged in', '2026-08-05 19:05:02'),
(50, 2, 'Created ticket TKT-2026-8AE5B2', '2026-08-05 19:05:28'),
(51, 1, 'User logged in', '2026-08-05 19:06:24'),
(52, 1, 'User logged in', '2026-08-06 12:27:00'),
(53, 2, 'User logged in', '2026-08-06 12:27:37'),
(54, 2, 'Created ticket TKT-2026-1946E2', '2026-08-06 12:28:33'),
(55, 1, 'User logged in', '2026-08-06 12:29:05'),
(56, 1, 'User logged in', '2026-08-06 12:31:01'),
(57, 1, 'Updated ticket #24', '2026-08-06 12:31:21'),
(58, 1, 'Updated ticket #23', '2026-08-06 12:46:26'),
(59, 2, 'User logged in', '2026-08-06 12:46:36'),
(60, 1, 'User logged in', '2026-08-06 12:47:55'),
(61, 3, 'User logged in', '2026-08-06 12:53:58'),
(62, 3, 'Created ticket TKT-2026-20958D', '2026-08-06 12:54:10'),
(63, 1, 'User logged in', '2026-08-06 12:54:19'),
(64, 3, 'User logged in', '2026-08-06 12:54:58'),
(65, 3, 'Updated ticket #25', '2026-08-06 12:55:06'),
(66, 1, 'User logged in', '2026-08-06 12:55:29'),
(67, 3, 'User logged in', '2026-08-06 14:05:00'),
(68, 1, 'User logged in', '2026-08-06 14:05:19'),
(69, 2, 'User logged in', '2026-08-06 14:05:42'),
(70, 2, 'Created ticket TKT-2026-EABFB9', '2026-08-06 14:05:50'),
(71, 1, 'User logged in', '2026-08-06 14:05:58'),
(72, 2, 'User logged in', '2026-08-06 14:10:38'),
(73, 1, 'User logged in', '2026-08-06 14:11:11'),
(74, 2, 'User logged in', '2026-08-06 14:21:34'),
(75, 2, 'User logged in', '2026-08-06 14:23:22'),
(76, 1, 'User logged in', '2026-08-06 14:29:27'),
(77, 1, 'Updated ticket #25', '2026-08-06 14:29:34'),
(78, 2, 'User logged in', '2026-08-06 14:29:41'),
(79, 1, 'User logged in', '2026-08-06 14:29:53'),
(80, 2, 'User logged in', '2026-08-06 14:30:26'),
(81, 2, 'Updated ticket #24', '2026-08-06 14:31:04'),
(82, 2, 'Updated ticket #24', '2026-08-06 14:31:04'),
(83, 2, 'Updated ticket #24', '2026-08-06 14:31:05'),
(84, 2, 'Updated ticket #24', '2026-08-06 14:31:06'),
(85, 1, 'User logged in', '2026-08-06 14:36:10');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(5, 'Access Request'),
(4, 'Email'),
(1, 'Hardware'),
(3, 'Network'),
(6, 'Other'),
(2, 'Software');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `ticket_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`, `ticket_id`) VALUES
(1, 2, 'Ticket #24 status changed', 1, '2026-08-06 12:31:21', NULL),
(2, 2, 'Ticket #23 status changed', 1, '2026-08-06 12:46:26', NULL),
(3, 1, 'New user registered: Racha', 1, '2026-08-06 12:53:51', NULL),
(4, 1, 'New ticket created: TKT-2026-20958D', 1, '2026-08-06 12:54:10', NULL),
(5, 1, 'New comment on ticket #25', 1, '2026-08-06 14:05:11', 25),
(6, 1, 'New ticket created: TKT-2026-EABFB9', 1, '2026-08-06 14:05:50', 26),
(7, 2, 'New comment on ticket #26', 1, '2026-08-06 14:10:26', 26),
(8, 2, 'New comment on ticket #26', 1, '2026-08-06 14:21:27', 26),
(9, 3, 'Ticket TKT-2026-20958D status changed', 0, '2026-08-06 14:29:34', 25),
(10, 2, 'New comment on ticket TKT-2026-1946E2', 1, '2026-08-06 14:30:17', 24),
(11, 2, 'New comment on ticket TKT-2026-1946E2', 1, '2026-08-06 14:30:17', 24),
(12, 1, 'Ticket TKT-2026-1946E2 was updated', 1, '2026-08-06 14:31:04', 24),
(13, 1, 'Ticket TKT-2026-1946E2 was updated', 1, '2026-08-06 14:31:04', 24),
(14, 1, 'Ticket TKT-2026-1946E2 was updated', 1, '2026-08-06 14:31:05', 24),
(15, 1, 'Ticket TKT-2026-1946E2 was updated', 1, '2026-08-06 14:31:06', 24);

-- --------------------------------------------------------

--
-- Table structure for table `priorities`
--

CREATE TABLE `priorities` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `priorities`
--

INSERT INTO `priorities` (`id`, `name`) VALUES
(4, 'Critical'),
(3, 'High'),
(1, 'Low'),
(2, 'Medium');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Admin'),
(3, 'Employee'),
(2, 'IT Support Agent'),
(4, 'Manager');

-- --------------------------------------------------------

--
-- Table structure for table `statuses`
--

CREATE TABLE `statuses` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `statuses`
--

INSERT INTO `statuses` (`id`, `name`) VALUES
(5, 'Closed'),
(2, 'In Progress'),
(1, 'Open'),
(3, 'Pending'),
(4, 'Resolved');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `reference_no` varchar(20) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `priority_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `reference_no`, `title`, `description`, `category_id`, `priority_id`, `status_id`, `created_by`, `assigned_to`, `created_at`, `updated_at`) VALUES
(14, 'TKT-2026-ECE5D5', 'try2000', '', 3, 2, 1, 1, NULL, '2026-07-31 18:17:50', '2026-07-31 18:17:50'),
(15, 'TKT-2026-6A25C9', 'try20001', '', 3, 3, 1, 1, NULL, '2026-07-31 18:19:18', '2026-07-31 18:19:18'),
(16, 'TKT-2026-B7391F', 'sbwbdh', '', 2, 3, 1, 1, NULL, '2026-07-31 18:19:55', '2026-07-31 18:19:55'),
(17, 'TKT-2026-969974', 'try 2001', '', 4, 3, 1, 1, NULL, '2026-08-03 14:04:09', '2026-08-03 14:04:09'),
(18, 'TKT-2026-CC0435', 'try 2002', '', 4, 3, 1, 1, NULL, '2026-08-03 14:05:48', '2026-08-03 14:05:48'),
(19, 'TKT-2026-994DBF', 'try 2003', '', 3, 2, 1, 1, NULL, '2026-08-03 14:07:05', '2026-08-03 14:07:05'),
(20, 'TKT-2026-944DD3', 'try 2004', '', 3, 4, 4, 1, NULL, '2026-08-03 14:23:37', '2026-08-04 10:12:43'),
(21, 'TKT-2026-EC5CFE', 'try 2005', '', 5, 3, 4, 1, NULL, '2026-08-03 14:24:30', '2026-08-04 10:12:36'),
(22, 'TKT-2026-FA017A', 'ghggdhj', '', 2, 2, 4, 1, NULL, '2026-08-05 18:01:19', '2026-08-05 18:02:00'),
(23, 'TKT-2026-8AE5B2', 'AccountError', '', 1, 2, 4, 2, NULL, '2026-08-05 19:05:28', '2026-08-06 12:46:26'),
(24, 'TKT-2026-1946E2', 'tryy2003', '', 3, 2, 5, 2, NULL, '2026-08-06 12:28:33', '2026-08-06 14:31:06'),
(25, 'TKT-2026-20958D', 'try1', '', 2, 3, 4, 3, NULL, '2026-08-06 12:54:10', '2026-08-06 14:29:34'),
(26, 'TKT-2026-EABFB9', 'ksjflksd', '', 3, 3, 1, 2, NULL, '2026-08-06 14:05:50', '2026-08-06 14:05:50');

-- --------------------------------------------------------

--
-- Table structure for table `ticket_attachments`
--

CREATE TABLE `ticket_attachments` (
  `id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket_attachments`
--

INSERT INTO `ticket_attachments` (`id`, `ticket_id`, `file_path`, `file_type`, `uploaded_at`) VALUES
(1, 16, 'uploads/IT_Help_Desk_1785754954.pdf', 'application/pdf', '2026-08-03 14:02:34'),
(2, 20, 'uploads/IT_Help_Desk_1785756217.pdf', 'application/pdf', '2026-08-03 14:23:37'),
(3, 21, 'uploads/IT_Help_Desk_1785756270.pdf', 'application/pdf', '2026-08-03 14:24:30'),
(4, 24, 'uploads/Hala_Ali_Swed_CV_Updated_1786008514.pdf', 'application/pdf', '2026-08-06 12:28:34');

-- --------------------------------------------------------

--
-- Table structure for table `ticket_comments`
--

CREATE TABLE `ticket_comments` (
  `id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket_comments`
--

INSERT INTO `ticket_comments` (`id`, `ticket_id`, `user_id`, `comment`, `created_at`) VALUES
(1, 21, 1, '2 days maximum and it\'s done', '2026-08-03 15:12:11'),
(2, 21, 1, 'bda shi one day baed', '2026-08-05 17:51:28'),
(3, 25, 3, 'meche lhal', '2026-08-06 12:55:19'),
(4, 25, 3, 'merci', '2026-08-06 14:05:11'),
(5, 26, 1, 'tamem', '2026-08-06 14:10:26'),
(6, 26, 1, 'hahahah', '2026-08-06 14:21:27'),
(7, 24, 1, 'bla bla', '2026-08-06 14:30:17'),
(8, 24, 1, 'bla bla', '2026-08-06 14:30:17');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `password_hash`, `created_at`, `reset_token`, `reset_token_expires_at`) VALUES
(1, 1, 'Hala', 'halaswed0@gmail.com', '$2y$10$G5m9XbCyM/Fn.5SL4pqlkurIEYSwdeJ9Rgk/trDqQdztlxoCTnZka', '2026-07-09 20:07:42', '679472c995c023f5242903b5b540fd22956e610316010f1c2ecac7ba8aaf32f1', '2026-07-16 16:45:27'),
(2, 3, 'Hawraa Sweid', 'hawraaswed@gmail.com', '$2y$10$08fnvto9tBlkRUyv1GkHDO1uA3EEpT5Bg1Ey5GX5KJTmqtf0XBlUm', '2026-08-05 19:04:56', NULL, NULL),
(3, 3, 'Racha', 'cellalo588@gmail.com', '$2y$10$QP63aZ9KMMl9L9nsFAhPBunewlL3.PH4Npdi76vkajYkQM7re82vm', '2026-08-06 12:53:51', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `priorities`
--
ALTER TABLE `priorities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_no` (`reference_no`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `priority_id` (`priority_id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `assigned_to` (`assigned_to`);

--
-- Indexes for table `ticket_attachments`
--
ALTER TABLE `ticket_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_id` (`ticket_id`);

--
-- Indexes for table `ticket_comments`
--
ALTER TABLE `ticket_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `priorities`
--
ALTER TABLE `priorities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `statuses`
--
ALTER TABLE `statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `ticket_attachments`
--
ALTER TABLE `ticket_attachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ticket_comments`
--
ALTER TABLE `ticket_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`priority_id`) REFERENCES `priorities` (`id`),
  ADD CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`),
  ADD CONSTRAINT `tickets_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tickets_ibfk_5` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`);

--
-- Constraints for table `ticket_attachments`
--
ALTER TABLE `ticket_attachments`
  ADD CONSTRAINT `ticket_attachments_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`);

--
-- Constraints for table `ticket_comments`
--
ALTER TABLE `ticket_comments`
  ADD CONSTRAINT `ticket_comments_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`),
  ADD CONSTRAINT `ticket_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
