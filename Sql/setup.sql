CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `cards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `serial` varchar(50) NOT NULL,
  `holo` varchar(50) NOT NULL,
  `set` varchar(50) NOT NULL,
  `subset` varchar(50) NOT NULL,
  `rarity` varchar(50) NOT NULL,
  `imgCode` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
  FOREIGN KEY (userId) REFERENCES users(Id)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- TODO: add table for login, and add a user in this script

-- TODO: check this works as intended
CREATE USER 'admin'@'%' IDENTIFIED VIA mysql_native_password 
  USING '***';GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' 
  REQUIRE NONE WITH GRANT OPTION MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 
  MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;GRANT ALL PRIVILEGES ON `pokemontracker`.* TO 'admin'@'%';

-- use companydirectory on namecheap to see how to create admin user