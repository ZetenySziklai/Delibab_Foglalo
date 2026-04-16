-- asztalfoglalas adatbázis teljes dump
-- Importáláskor elveti és újra létrehozza az adatbázist

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- --------------------------------------------------------
-- Adatbázis eldobása és újra létrehozása
-- --------------------------------------------------------

DROP DATABASE IF EXISTS `asztalfoglalas`;
CREATE DATABASE `asztalfoglalas`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_hungarian_ci;

USE `asztalfoglalas`;

-- --------------------------------------------------------
-- Tábla: `asztal`
-- --------------------------------------------------------

CREATE TABLE `asztal` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `helyek_szama` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `asztal` (`id`, `helyek_szama`) VALUES
(1, 2),
(2, 4),
(3, 6),
(4, 8);

-- --------------------------------------------------------
-- Tábla: `felhasznalo`
-- --------------------------------------------------------

CREATE TABLE `felhasznalo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `vezeteknev` VARCHAR(50) NOT NULL,
  `keresztnev` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `telefonszam` VARCHAR(20) NOT NULL,
  `regisztracio_datuma` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `jelszo` VARCHAR(255) NOT NULL,
  `isAdmin` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `felhasznalo` (`id`, `vezeteknev`, `keresztnev`, `email`, `telefonszam`, `regisztracio_datuma`, `jelszo`, `isAdmin`) VALUES
(1, 'Admin', 'Admin', 'admin@delibab.hu', '+36301234567', '2025-01-10 08:30:00', '$2b$10$8wXgmp5i4.wVrKg1IX8hhukHI3BIH5nH.Yei4qmzFsF1As1k3HNEW', 1),
(2, 'Kiss', 'Éva', 'kiss.eva@email.hu', '+36207654321', '2025-02-15 10:00:00', '$2b$10$bDpOUf9zTkJmpER6bNb4W.o6B2P.NWLLVerht/3JYGq.rRdfu5Zw.', 0),
(3, 'Szabó', 'Péter', 'szabo.peter@email.hu', '+36309876543', '2025-03-20 14:45:00', '$2b$10$7iM9w9se8m9k5ABxRh7pG.P.M6D6K0zznrCltfrQq0QzRSScq/xce', 0),
(4, 'Tóth', 'Anna', 'toth.anna@email.hu', '+36201112233', '2025-04-05 09:15:00', '$2b$10$f1.iPB7jIR5t/rilrglDeellAfIu1GnTCXqp1ySQ6e/YzSr1WErgO', 0);

-- --------------------------------------------------------
-- Tábla: `idopont`
-- --------------------------------------------------------

CREATE TABLE `idopont` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `kezdet` DOUBLE NOT NULL,
  `veg` DOUBLE NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `idopont` (`id`, `kezdet`, `veg`) VALUES
(1, 8.0, 9.0),
(2, 9.5, 10.5),
(3, 11.0, 12.0),
(4, 12.5, 13.5);

-- --------------------------------------------------------
-- Tábla: `foglalas`
-- --------------------------------------------------------

CREATE TABLE `foglalas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `asztal_id` INT NOT NULL,
  `foglalas_datum` DATETIME NOT NULL,
  `IdopontId` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `asztal_id` (`asztal_id`),
  KEY `IdopontId` (`IdopontId`),
  CONSTRAINT `foglalas_ibfk_felhasznalo` FOREIGN KEY (`user_id`) REFERENCES `felhasznalo` (`id`),
  CONSTRAINT `foglalas_ibfk_asztal` FOREIGN KEY (`asztal_id`) REFERENCES `asztal` (`id`),
  CONSTRAINT `foglalas_ibfk_idopont` FOREIGN KEY (`IdopontId`) REFERENCES `idopont` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------
-- Tábla: `foglalasiAdatok`
-- --------------------------------------------------------

CREATE TABLE `foglalasiAdatok` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `foglalas_datum` DATETIME NOT NULL,
  `megjegyzes` VARCHAR(255) DEFAULT NULL,
  `felnott` INT NOT NULL,
  `gyerek` INT NOT NULL,
  `FoglalasId` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FoglalasId` (`FoglalasId`),
  CONSTRAINT `foglalasiAdatok_ibfk_foglalas` FOREIGN KEY (`FoglalasId`) REFERENCES `foglalas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

COMMIT;
