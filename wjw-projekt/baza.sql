-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 06 Lis 2025, 13:58
-- Wersja serwera: 10.4.27-MariaDB
-- Wersja PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `baza`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ekspertyzy`
--

CREATE TABLE `ekspertyzy` (
  `id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `klients_id` int(11) NOT NULL,
  `wycena` decimal(10,2) DEFAULT NULL,
  `status` enum('oczekuje','w trakcie','wykonane') DEFAULT 'oczekuje'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `ekspertyzy`
--

INSERT INTO `ekspertyzy` (`id`, `message_id`, `klients_id`, `wycena`, `status`) VALUES
(1, 1, 1, '1200.00', 'oczekuje'),
(2, 2, 2, '1500.00', 'w trakcie'),
(3, 3, 3, '2100.00', 'wykonane'),
(4, 4, 4, '1000.00', 'wykonane'),
(5, 5, 5, '950.00', 'w trakcie');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `klients`
--

CREATE TABLE `klients` (
  `id` int(11) NOT NULL,
  `imie` varchar(100) NOT NULL,
  `mail` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `klients`
--

INSERT INTO `klients` (`id`, `imie`, `mail`) VALUES
(0, 'test', 'test'),
(1, 'Anna Kowalska', 'anna.kowalska@example.com'),
(2, 'Piotr Nowak', 'piotr.nowak@example.com'),
(3, 'Katarzyna Wiśniewska', 'k.wisniewska@example.com'),
(4, 'Tomasz Zieliński', 't.zielinski@example.com'),
(5, 'Magdalena Wójcik', 'magdalena.wojcik@example.com');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `imie` varchar(100) NOT NULL,
  `mail` varchar(150) NOT NULL,
  `adres` varchar(150) DEFAULT NULL,
  `wiadomosc` text NOT NULL,
  `data_wyslania` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `messages`
--

INSERT INTO `messages` (`id`, `imie`, `mail`, `adres`, `wiadomosc`, `data_wyslania`) VALUES
(1, 'Anna Kowalska', 'anna.kowalska@example.com', 'ul. Mickiewicza 10', 'Dzień dobry, proszę o wykonanie ekspertyzy przeciwpożarowej dla budynku biurowego przy ul. Mickiewicza 10 w Warszawie.', '2025-01-12 09:15:00'),
(2, 'Piotr Nowak', 'piotr.nowak@example.com', 'ul. Główna 25', 'Witam, potrzebuję ekspertyzy ppoż dla hali magazynowej o powierzchni 1200 m2 w Poznaniu.', '2025-02-03 14:40:00'),
(3, 'Katarzyna Wiśniewska', 'k.wisniewska@example.com', 'ul. Długa 14', 'Zwracam się z prośbą o przygotowanie ekspertyzy przeciwpożarowej dla nowo otwieranej galerii handlowej w Krakowie.', '2025-02-25 10:05:00'),
(4, 'Tomasz Zieliński', 't.zielinski@example.com', 'ul. Lipowa 5', 'Proszę o ofertę na ekspertyzę ppoż dla budynku szkoły podstawowej przy ul. Lipowej w Lublinie.', '2025-03-14 08:50:00'),
(5, 'Magdalena Wójcik', 'magdalena.wojcik@example.com', 'ul. Kościuszki 9', 'Chciałabym zlecić wykonanie ekspertyzy przeciwpożarowej dla domu kultury w Katowicach.', '2025-04-02 11:30:00'),
(6, 'Jakub Kamiński', 'jakub.kaminski@example.com', 'ul. Sportowa 7', 'Potrzebuję ekspertyzy przeciwpożarowej dla obiektu sportowego (hala widowiskowa) w Gdańsku.', '2025-04-28 16:45:00'),
(7, 'Ewa Lewandowska', 'ewa.lewandowska@example.com', 'ul. Jeziorna 3', 'Proszę o wycenę i termin realizacji ekspertyzy przeciwpożarowej dla hotelu nad jeziorem w Mikołajkach.', '2025-05-17 09:20:00'),
(8, 'Marcin Dąbrowski', 'marcin.dabrowski@example.com', 'ul. Zielona 11', 'Zwracam się z zapytaniem o możliwość wykonania ekspertyzy ppoż dla budynku mieszkalnego wielorodzinnego w Łodzi.', '2025-06-06 13:05:00'),
(9, 'Agnieszka Król', 'agnieszka.krol@example.com', 'ul. Sztuki 2', 'Proszę o ekspertyzę przeciwpożarową dla galerii sztuki w centrum Wrocławia.', '2025-07-22 10:50:00'),
(10, 'Paweł Kwiatkowski', 'pawel.kwiatkowski@example.com', 'ul. Produkcyjna 18', 'Potrzebujemy ekspertyzy przeciwpożarowej dla zakładu produkcyjnego w Bydgoszczy.', '2025-08-15 15:35:00'),
(13, 'imie nazwisko', 'email@mail.com', 'ulica 12, miasto ', 'tresc wiadomosci', '2025-11-06 13:55:47');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `ekspertyzy`
--
ALTER TABLE `ekspertyzy`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_id` (`message_id`),
  ADD KEY `fk_ekspertyzy_klient` (`klients_id`);

--
-- Indeksy dla tabeli `klients`
--
ALTER TABLE `klients`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `ekspertyzy`
--
ALTER TABLE `ekspertyzy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT dla tabeli `klients`
--
ALTER TABLE `klients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT dla tabeli `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `ekspertyzy`
--
ALTER TABLE `ekspertyzy`
  ADD CONSTRAINT `ekspertyzy_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ekspertyzy_klient` FOREIGN KEY (`klients_id`) REFERENCES `klients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
