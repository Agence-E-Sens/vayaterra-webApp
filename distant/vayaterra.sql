-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Mer 25 Mai 2016 à 15:12
-- Version du serveur :  5.7.9
-- Version de PHP :  5.6.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `vayaterra`
--

-- --------------------------------------------------------

--
-- Structure de la table `appli_events`
--

DROP TABLE IF EXISTS `appli_events`;
CREATE TABLE IF NOT EXISTS `appli_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `desc` longtext NOT NULL,
  `d_creation` date NOT NULL,
  `duree` varchar(100) NOT NULL,
  `img` longtext,
  `id_poi` bigint(21) NULL,
  PRIMARY KEY (`id`),
  KEY `fk_poi_to_event` (`id_poi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `appli_poi`
--

DROP TABLE IF EXISTS `appli_poi`;
CREATE TABLE IF NOT EXISTS `appli_poi` (
  `id` bigint(21) NOT NULL AUTO_INCREMENT,
  `id_voyageur` bigint(21) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `desc` longtext NOT NULL,
  `latitude` varchar(45) NOT NULL,
  `longitude` varchar(45) NOT NULL,
  `date` date NOT NULL,
  `privacy` varchar(45) NOT NULL,
  `img` longtext,
  PRIMARY KEY (`id`),
  KEY `fk_id_voyageur` (`id_voyageur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `appli_tracing`
--

DROP TABLE IF EXISTS `appli_tracing`;
CREATE TABLE IF NOT EXISTS `appli_tracing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serie5` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `appli_events`
--
ALTER TABLE `appli_events`
  ADD CONSTRAINT `fk_poi_to_event` FOREIGN KEY (`id_poi`) REFERENCES `appli_poi` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `appli_poi`
--
ALTER TABLE `appli_poi`
  ADD CONSTRAINT `fk_id_voyageur` FOREIGN KEY (`id_voyageur`) REFERENCES `spip_auteurs` (`id_auteur`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
