-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Vytvořeno: Úte 11. úno 2020, 20:07
-- Verze serveru: 10.0.38-MariaDB-0+deb8u1
-- Verze PHP: 7.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Struktura tabulky `spaserverexample_studenti`
--

CREATE TABLE `spaserverexample_studenti` (
  `id` int(11) NOT NULL,
  `tridy_id` int(11) NOT NULL,
  `jmeno` varchar(100) COLLATE utf8_czech_ci NOT NULL,
  `prijmeni` varchar(100) COLLATE utf8_czech_ci NOT NULL,
  `cislo_podle_tridnice` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `spaserverexample_tridy`
--

CREATE TABLE `spaserverexample_tridy` (
  `id` int(11) NOT NULL,
  `rocnik` int(2) NOT NULL,
  `oznaceni` varchar(10) COLLATE utf8_czech_ci NOT NULL,
  `maturitni_rok` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;


--
-- Klíče pro exportované tabulky
--

--
-- Klíče pro tabulku `spaserverexample_studenti`
--
ALTER TABLE `spaserverexample_studenti`
  ADD PRIMARY KEY (`id`);

--
-- Klíče pro tabulku `spaserverexample_tridy`
--
ALTER TABLE `spaserverexample_tridy`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `spaserverexample_studenti`
--
ALTER TABLE `spaserverexample_studenti`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT pro tabulku `spaserverexample_tridy`
--
ALTER TABLE `spaserverexample_tridy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
