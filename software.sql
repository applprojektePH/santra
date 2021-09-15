-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 15. Sep 2021 um 16:15
-- Server-Version: 10.4.18-MariaDB
-- PHP-Version: 7.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `santra`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `software`
--

CREATE TABLE `software` (
  `orderid` int(100) NOT NULL,
  `institut` text COLLATE utf8mb4_german2_ci NOT NULL,
  `professur` text COLLATE utf8mb4_german2_ci NOT NULL,
  `vorname` text COLLATE utf8mb4_german2_ci NOT NULL,
  `nachname` text COLLATE utf8mb4_german2_ci NOT NULL,
  `email` text COLLATE utf8mb4_german2_ci NOT NULL,
  `funktion` text COLLATE utf8mb4_german2_ci NOT NULL,
  `studiengang` text COLLATE utf8mb4_german2_ci NOT NULL,
  `modulanlass` text COLLATE utf8mb4_german2_ci NOT NULL,
  `szenario` text COLLATE utf8mb4_german2_ci NOT NULL,
  `softwarename` text COLLATE utf8mb4_german2_ci NOT NULL,
  `softwarewebseite` text COLLATE utf8mb4_german2_ci NOT NULL,
  `softwareupdate` char(10) COLLATE utf8mb4_german2_ci NOT NULL,
  `softwareupdatewelches` text COLLATE utf8mb4_german2_ci NOT NULL,
  `lizenzenanzahl` int(50) NOT NULL,
  `nutzeranzahl` int(50) NOT NULL,
  `nutzungsdauer` int(50) NOT NULL,
  `betriebssystem` text COLLATE utf8mb4_german2_ci NOT NULL,
  `browser` text COLLATE utf8mb4_german2_ci NOT NULL,
  `softwareverfuegung` text COLLATE utf8mb4_german2_ci NOT NULL,
  `softwareinteresse` text COLLATE utf8mb4_german2_ci NOT NULL,
  `softwareinstitut` text COLLATE utf8mb4_german2_ci NOT NULL,
  `softwarehochschinteresse` text COLLATE utf8mb4_german2_ci NOT NULL,
  `softwarehochschule` text COLLATE utf8mb4_german2_ci NOT NULL,
  `lizenzinstitution` text COLLATE utf8mb4_german2_ci NOT NULL,
  `lizenzart` text COLLATE utf8mb4_german2_ci NOT NULL,
  `lizenzkosten` text COLLATE utf8mb4_german2_ci NOT NULL,
  `vergleichbarkeit` text COLLATE utf8mb4_german2_ci NOT NULL,
  `support` text COLLATE utf8mb4_german2_ci NOT NULL,
  `cloud` text COLLATE utf8mb4_german2_ci NOT NULL,
  `cloudwo` text COLLATE utf8mb4_german2_ci NOT NULL,
  `productowner` text COLLATE utf8mb4_german2_ci NOT NULL,
  `bemerkungen` text COLLATE utf8mb4_german2_ci NOT NULL,
  `datum` date NOT NULL,
  `userid` int(11) NOT NULL,
  `status` int(10) NOT NULL,
  `notizen` text COLLATE utf8mb4_german2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Daten für Tabelle `software`
--

INSERT INTO `software` (`orderid`, `institut`, `professur`, `vorname`, `nachname`, `email`, `funktion`, `studiengang`, `modulanlass`, `szenario`, `softwarename`, `softwarewebseite`, `softwareupdate`, `softwareupdatewelches`, `lizenzenanzahl`, `nutzeranzahl`, `nutzungsdauer`, `betriebssystem`, `browser`, `softwareverfuegung`, `softwareinteresse`, `softwareinstitut`, `softwarehochschinteresse`, `softwarehochschule`, `lizenzinstitution`, `lizenzart`, `lizenzkosten`, `vergleichbarkeit`, `support`, `cloud`, `cloudwo`, `productowner`, `bemerkungen`, `datum`, `userid`, `status`, `notizen`) VALUES
(1, 'PH', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '0000-00-00', 0, 2, ''),
(2, 'IGEO', 'TestProfessur', 'Alesya', 'Heymann', 'alesya.heymann@fhnw.ch', 'Testfunktion', 'Teststudiengang', 'Testmodulanlass', 'testszenario', 'Softwarename', 'softwarewebseite', 'nein', '', 2, 2, 2, 'betriebssystem', 'browser', 'softwareverfuegung	', '', 'softwareinstitut', '', 'softwarehochschule	', 'lizenzinstitution', 'lizenzart', 'lizenzkosten', 'vergleichbarkeit', 'support', 'ja', '', 'productowner', 'bemerkungen', '2021-05-11', 123, 3, ''),
(3, 'IGEO', 'TestProfessur', 'Alesya', 'Heymann', 'alesya.heymann@fhnw.ch', 'Testfunktion', 'Teststudiengang', 'Testmodulanlass', 'testszenario', 'Softwarename', 'softwarewebseite', '', '', 2, 2, 2, 'betriebssystem', 'browser', 'softwareverfuegung	', '', 'softwareinstitut', '', 'softwarehochschule	', 'lizenzinstitution', 'lizenzart', 'lizenzkosten', 'vergleichbarkeit', 'support', 'cloud', '', 'productowner', 'bemerkungen', '2021-05-11', 123, 1, ''),
(181, 'Kindergarten-/Unterstufe', '', '', '', '', '', '', '', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 0, 0, 0, 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', '0000-00-00', 123, 1, 'undefined'),
(182, 'Kindergarten-/Unterstufe', '', '', '', '', '', '', '', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 0, 0, 0, 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', '0000-00-00', 123, 1, 'undefined'),
(183, 'undefined', '', '', '', '', '', '', '', '', '', '', 'undefined', 'undefined', 0, 0, 0, 'undefined', 'undefined', 'undefined', 'undefined', '', 'undefined', '', 'undefined', 'undefined', 'undefined', '', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', '0000-00-00', 123, 1, 'undefined');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `software`
--
ALTER TABLE `software`
  ADD PRIMARY KEY (`orderid`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `software`
--
ALTER TABLE `software`
  MODIFY `orderid` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=184;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
