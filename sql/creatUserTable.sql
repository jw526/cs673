/* ===== Login tables ===== */
CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    password CHAR (40) NOT NULL,
    username CHAR (40) NOT NULL,
    last_name CHAR (20) NOT NULL,
    first_name CHAR (20) NOT NULL,
    date_registered DATE NOT NULL,
    date_login DATE NOT NULL
) DEFAULT CHARACTER SET utf8;
/* ===== End login tables ===== */








