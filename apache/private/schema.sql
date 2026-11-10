-- Database voor het contactformulier van www.audacious.com (DirectAdmin-server).
--
-- Hoeft niet met de hand: de PHP-verwerker maakt deze tabellen zelf aan bij
-- het eerste bericht als ze ontbreken. Dit bestand is er om te zien wat er
-- precies wordt opgeslagen (en kan in phpMyAdmin worden uitgevoerd).
--
-- Wat er NIET wordt opgeslagen: de bijlagen zelf (alleen naam en grootte; de
-- bestanden gaan alleen met de mail mee) en het IP-adres (alleen een gezouten
-- hash, en alleen tien minuten, voor de limiet op het aantal berichten per
-- verbinding).

CREATE TABLE IF NOT EXISTS aanvragen (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ontvangen_op DATETIME NOT NULL COMMENT 'UTC',
  naam VARCHAR(200) NOT NULL,
  bedrijf VARCHAR(200) NOT NULL DEFAULT '',
  email VARCHAR(254) NOT NULL,
  telefoon VARCHAR(60) NOT NULL DEFAULT '',
  onderwerp VARCHAR(200) NOT NULL DEFAULT '',
  materiaal_bewerking VARCHAR(500) NULL,
  aantal_planning VARCHAR(500) NULL,
  bericht TEXT NOT NULL,
  pagina VARCHAR(500) NULL,
  bijlagen TEXT NULL COMMENT 'bestandsnamen en groottes, geen inhoud',
  verzonden TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = mail door Microsoft 365 aangenomen',
  verzendfout VARCHAR(500) NULL,
  PRIMARY KEY (id),
  KEY ontvangen_op (ontvangen_op)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS formulier_pogingen (
  ip_hash CHAR(64) NOT NULL,
  poging_op INT UNSIGNED NOT NULL COMMENT 'Unix-tijd',
  KEY ip_hash (ip_hash, poging_op)
) ENGINE=InnoDB DEFAULT CHARSET=ascii;
