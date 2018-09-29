CREATE DATABASE investments_management_system;


/* Table will store user information */
CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    password CHAR (40) NOT NULL,
    username CHAR (40) NOT NULL,
    last_name CHAR (20) NOT NULL,
    first_name CHAR (20) NOT NULL,
    date_registered DATE NOT NULL,
    date_login DATETIME NOT NULL NOT NULL DEFAULT NOW()
) DEFAULT CHARACTER SET utf8;



 

/* Table will store portfolios */
CREATE TABLE portfolio (
    portfolio_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    portfolio_name VARCHAR (40) NOT NULL,
    
    /* == 1 == should be inserted if portfolio is open and == 0 == should be inserted if portfolio is closed */
    open_close INT NOT NULL,
    created_timestamp DATETIME, 
    closed_timestamp DATETIME 
) DEFAULT CHARACTER SET utf8;


/* === Creating portfolio === */
INSERT INTO portfolio (user_id, 
                       portfolio_name, 
                       open_close, 
                       created_timestamp)
     VALUES ('$_SESSION[user_id]',
             '$portfolio_name',
             1,
             NOW());
             
             
/* === Closing portfolio === */
UPDATE portfolio 
   SET open_close = 0,
       closed_timestamp = NOW()
 WHERE portfolio_id = '$portfolio_id'
   AND user_id = '$_SESSION[user_id]';
   
   
/* === Selecting user portfolios name and date created === */
SELECT portfolio_name, 
       DATE_FORMAT(created_timestamp, "%c-%d-%Y %H:%i:%S")
  FROM portfolio
 WHERE user_id = '$_SESSION[user_id]'
   AND open_close = 1
 ORDER BY portfolio_name ASC;








/* Table will store all and each stock transaction */
CREATE TABLE transactions (
    transaction_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,    
    portfolio_id INT NOT NULL,
    user_id INT NOT NULL,
    
    /* Stock market name should be inserted == Dow-30 or BSE/NSE */
    stock_market CHAR (10) NOT NULL,
    ticker VARCHAR (10) NOT NULL,
    company_name VARCHAR (30) NOT NULL,
    
    /* If stock is purchased == positive value of number of shares purchased should be inserted == and == negetive value should be inserted of the number of shares sold == */
    quantity DECIMAL (15,4) NOT NULL, 
    
    /* price per one share */
    price DECIMAL (15,2) NOT NULL, 
    
    /* Value inserted here should by == buy == or == sell == */
    transaction_action VARCHAR (10) NOT NULL, 
    transaction_timestamp DATETIME NOT NULL DEFAULT NOW()    
) DEFAULT CHARACTER SET utf8;


/* === Inserting stock transactions === */
INSERT INTO transactions (portfolio_id,
                          user_id, 
                          stock_market, 
                          ticker, 
                          company_name,
                          quantity,
                          price,
                          transaction_action,
                          transaction_timestamp)
     VALUES ('$portfolio_id',
             '$_SESSION[user_id]',
             '$stock_market',
             '$ticker',
             '$company_name',
             '$quantity',
             '$price',
             '$transaction_action',
             NOW());
             
             
/* === Selecting infor from transaction table and portfolio table === */
SELECT portfolio.portfolio_name AS portfolio_name,
       DATE_FORMAT(portfolio.created_timestamp, "%c-%d-%Y %H:%i:%S") AS portfolio_created,
       transactions.quantity AS total_stock,
       transactions.stock_market AS stock_market,
       transactions.ticker AS ticker,
       transactions.company_name AS company_name,
       transactions.price AS price,
       transactions.transaction_action AS action,
       DATE_FORMAT(transactions.transaction_timestamp, "%c-%d-%Y %H:%i:%S") AS transaction_date
  FROM portfolio
  JOIN transactions 
    ON portfolio.portfolio_id = transactions.portfolio_id 
   AND portfolio.user_id = transactions.user_id
 WHERE portfolio.user_id = '$_SESSION[user_id]'
   AND portfolio.open_close = 1
ORDER BY transaction_date ASC;








/* Table will store all and each cash transaction */
CREATE TABLE cash (
    cash_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,    
    user_id INT NOT NULL,
    portfolio_id INT NOT NULL,
    
    /* If amount is added == positive dollar amount should be inserted == and == negetive dollar amount should be inserted if sum is removed or invested == */
    cash_amount DECIMAL (15,2) NOT NULL,
    
    /* Value inserted here should by == add == or == invested == or == withdraw == */
    cash_action VARCHAR (10) NOT NULL, 
    cash_timestamp DATETIME NOT NULL DEFAULT NOW()    
) DEFAULT CHARACTER SET utf8;


/* === Inserting cash transactions === */
INSERT INTO cash (user_id,
                  portfolio_id,
                  cash_amount,
                  cash_action,
                  cash_timestamp)
     VALUES ('$_SESSION[user_id]',
             '$portfolio_id',
             '$cash_amount',
             '$cash_action',
             NOW());
             

/* === Selecting data from cash table === */
SELECT SUM(cash_amount) AS total_cash,
       cash_action,
       DATE_FORMAT(cash_timestamp, "%c-%d-%Y %H:%i:%S")
  FROM cash
 WHERE user_id = '$_SESSION[user_id]'
   AND portfolio_id = '$portfolio_id' 
 ORDER BY cash_timestamp ASC;             
       
       
       
       
       
       
       
       

/* === Selectiong data for CSV file Grouping same stock together getting total purchased price and total stock purchased === */
SELECT portfolio.portfolio_name AS portfolio_name,
       DATE_FORMAT(portfolio.created_timestamp, "%c-%d-%Y %H:%i:%S") AS portfolio_created,
       transactions.quantity AS stock,
       transactions.stock_market AS stock_market,
       transactions.ticker AS ticker,
       transactions.company_name AS company_name,
       transactions.price AS purchased_price,
           SUM((SELECT (stock * purchased_price))) AS total_purchased_price,
           SUM((SELECT stock)) AS total_stock,
       DATE_FORMAT(transactions.transaction_timestamp, "%c-%d-%Y %H:%i:%S") AS transaction_date
  FROM portfolio
  JOIN transactions 
    ON portfolio.portfolio_id = transactions.portfolio_id 
   AND portfolio.user_id = transactions.user_id
 WHERE portfolio.user_id = '$_SESSION[user_id]'
   AND portfolio.open_close = 1
GROUP BY transactions.ticker
ORDER BY transaction_date ASC;


/* === Selectiong data for CSV file showing each stock transaction seperetly with total amount invested === */
SELECT portfolio.portfolio_name AS portfolio_name,
       DATE_FORMAT(portfolio.created_timestamp, "%c-%d-%Y %H:%i:%S") AS portfolio_created,
       transactions.quantity AS stock,
       transactions.stock_market AS stock_market,
       transactions.ticker AS ticker,
       transactions.company_name AS company_name,
       transactions.price AS purchased_price,
           (SELECT(stock * purchased_price)) AS total_price,
       DATE_FORMAT(transactions.transaction_timestamp, "%c-%d-%Y %H:%i:%S") AS transaction_date
  FROM portfolio
  JOIN transactions 
    ON portfolio.portfolio_id = transactions.portfolio_id 
   AND portfolio.user_id = transactions.user_id
 WHERE portfolio.user_id = '$_SESSION[user_id]'
   AND portfolio.open_close = 1
ORDER BY transaction_date ASC;































