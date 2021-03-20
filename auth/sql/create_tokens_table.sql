CREATE TABLE tokens (
	id INT UNSIGNED AUTO_INCREMENT NOT NULL,
	token VARCHAR(40) NOT NULL,
	userid INT UNSIGNED,
	expirationdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	creationdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	tokentype VARCHAR(40),
	PRIMARY KEY (id),
	UNIQUE KEY ix_token (token)
) ENGINE=InnoDB AUTO_INCREMENT=1 CHARSET=utf8;