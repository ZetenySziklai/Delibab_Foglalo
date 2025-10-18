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
-- Adatbázis: `asztalfoglalás`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglaló`
--

//foglalas legyen, tobb a tobbhoz legyen (user-asztal kozt) vagy egy a tobbhoz
CREATE TABLE `foglaló` (
  `vezetéknév` varchar(255) NOT NULL,
  `keresztnév` varchar(255) NOT NULL,
  `telefonszám` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `megjegyzés` varchar(255) NOT NULL,
  `foglalo_id` int(255) NOT NULL,
  `idopont_id` int(11) NOT NULL,
  `vendeg_id` int(11) NOT NULL,
  `etkezes_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `időpont`
--

//faszsag
CREATE TABLE `időpont` (
  `foglalás_nap_idő` datetime NOT NULL,
  `időpont_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vendégek_száma`
--

//ez csere user, asztal, megjegyzes, foglalo, social ossze koto( pl googleal jelentkezik be, szemelyzet)
CREATE TABLE `vendégek_száma` (
  `felnőtt` int(11) NOT NULL,
  `gyerek` int(11) NOT NULL,
  `vendeg_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `étkezés_típusa`
--

// ezt esweetleg tovabb okoskodni
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
  ADD PRIMARY KEY (`foglalo_id`),
  ADD KEY `idopont_id` (`idopont_id`),
  ADD KEY `vendeg_id` (`vendeg_id`),
  ADD KEY `etkezes_id` (`etkezes_id`);

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

--
-- A tábla indexei `étkezés_típusa`
--
ALTER TABLE `étkezés_típusa`
  ADD PRIMARY KEY (`etkezes_id`);

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `foglaló`
--
ALTER TABLE `foglaló`
  ADD CONSTRAINT `foglaló_ibfk_1` FOREIGN KEY (`idopont_id`) REFERENCES `időpont` (`időpont_id`),
  ADD CONSTRAINT `foglaló_ibfk_2` FOREIGN KEY (`vendeg_id`) REFERENCES `vendégek_száma` (`vendeg_id`),
  ADD CONSTRAINT `foglaló_ibfk_3` FOREIGN KEY (`etkezes_id`) REFERENCES `étkezés_típusa` (`etkezes_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
