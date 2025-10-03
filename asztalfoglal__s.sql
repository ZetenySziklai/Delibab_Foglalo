-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Okt 03. 08:13
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
-- Adatbázis: `asztalfoglalás`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglaló`
--

CREATE TABLE `foglaló` (
  `vezetéknév` varchar(255) NOT NULL,
  `keresztnév` varchar(255) NOT NULL,
  `telefonszám` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `megjegyzés` varchar(255) NOT NULL,
  `foglalo_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `időpont`
--

CREATE TABLE `időpont` (
  `foglalás_nap_idő` datetime NOT NULL,
  `időpont_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vendégek_száma`
--

CREATE TABLE `vendégek_száma` (
  `felnőtt` int(11) NOT NULL,
  `gyerek` int(11) NOT NULL,
  `vendeg_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `étkezés_típusa`
--

CREATE TABLE `étkezés_típusa` (
  `reggeli` tinyint(1) NOT NULL,
  `ebéd` tinyint(1) NOT NULL,
  `vacsora` tinyint(1) NOT NULL,
  `etkezes_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `foglaló`
--
ALTER TABLE `foglaló`
  ADD PRIMARY KEY (`foglalo_id`);

--
-- A tábla indexei `időpont`
--
ALTER TABLE `időpont`
  ADD PRIMARY KEY (`időpont_id`);

--
-- A tábla indexei `vendégek_száma`
--
ALTER TABLE `vendégek_száma`
  ADD PRIMARY KEY (`vendeg_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
