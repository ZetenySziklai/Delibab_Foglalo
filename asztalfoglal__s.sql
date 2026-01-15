-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Okt 03. 08:32
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `asztalfoglalas`
--
CREATE DATABASE IF NOT EXISTS `asztalfoglalas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `asztalfoglalas`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `Foglalo`
--

CREATE TABLE `Foglalo` (
  `foglalo_id` int(11) NOT NULL AUTO_INCREMENT,
  `vezeteknev` varchar(255) NOT NULL,
  `keresztnev` varchar(255) NOT NULL,
  `telefonszam` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `megjegyzes` varchar(255) NOT NULL,
  PRIMARY KEY (`foglalo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vezeteknev` varchar(255) NOT NULL,
  `keresztnev` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefonszam` varchar(20) NOT NULL,
  `regisztracio_datuma` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `asztal_allapot`
--

CREATE TABLE `asztal_allapot` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `asztal_allapot` (`id`, `nev`) VALUES
(1, 'Szabad'),
(2, 'Foglalt'),
(3, 'Takarítás alatt');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `asztal`
--

CREATE TABLE `asztal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `helyek_szama` int(11) NOT NULL,
  `asztal_allapot_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `asztal_allapot_id` (`asztal_allapot_id`),
  CONSTRAINT `asztal_ibfk_1` FOREIGN KEY (`asztal_allapot_id`) REFERENCES `asztal_allapot` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `etkezes_tipusa`
--

CREATE TABLE `etkezes_tipusa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `etkezes_tipusa` (`id`, `nev`) VALUES
(1, 'Reggeli'),
(2, 'Ebéd'),
(3, 'Vacsora');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `megjegyzes`
--

CREATE TABLE `megjegyzes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `szoveg` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalas`
--

CREATE TABLE `foglalas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `asztal_id` int(11) NOT NULL,
  `foglalas_datum` datetime NOT NULL,
  `etkezes_id` int(11) NOT NULL,
  `megjegyzes_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `asztal_id` (`asztal_id`),
  KEY `etkezes_id` (`etkezes_id`),
  KEY `megjegyzes_id` (`megjegyzes_id`),
  CONSTRAINT `foglalas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `foglalas_ibfk_2` FOREIGN KEY (`asztal_id`) REFERENCES `asztal` (`id`),
  CONSTRAINT `foglalas_ibfk_3` FOREIGN KEY (`etkezes_id`) REFERENCES `etkezes_tipusa` (`id`),
  CONSTRAINT `foglalas_ibfk_4` FOREIGN KEY (`megjegyzes_id`) REFERENCES `megjegyzes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `allergen`
--

CREATE TABLE `allergen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `allergeninfo`
--

CREATE TABLE `allergeninfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `allergen_id` int(11) NOT NULL,
  `foglalas_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `allergen_id` (`allergen_id`),
  KEY `foglalas_id` (`foglalas_id`),
  CONSTRAINT `allergeninfo_ibfk_1` FOREIGN KEY (`allergen_id`) REFERENCES `allergen` (`id`),
  CONSTRAINT `allergeninfo_ibfk_2` FOREIGN KEY (`foglalas_id`) REFERENCES `foglalas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `Idopont`
--

CREATE TABLE `Idopont` (
  `idopont_id` int(11) NOT NULL AUTO_INCREMENT,
  `foglalas_nap_ido` datetime NOT NULL,
  PRIMARY KEY (`idopont_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `VendegekSzama`
--

CREATE TABLE `VendegekSzama` (
  `vendeg_id` int(11) NOT NULL AUTO_INCREMENT,
  `felnott` int(11) NOT NULL,
  `gyerek` int(11) NOT NULL,
  PRIMARY KEY (`vendeg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
