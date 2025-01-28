-- Create users table
CREATE TABLE `users_db`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,          
  `uid` VARCHAR(255) DEFAULT NULL,           
  `evmAddress` TEXT DEFAULT NULL,            
  `signCrt` TEXT DEFAULT NULL,               
  `signCsr` TEXT DEFAULT NULL,               
  `signKey` TEXT DEFAULT NULL,               
  `tlsCsr` TEXT DEFAULT NULL,                
  `tlsKey` TEXT DEFAULT NULL,                
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (`id`)                         
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Optional: Insert sample users into the users table (remove if not needed)
LOCK TABLES `users_db`.`users` WRITE;
INSERT INTO `users_db`.`users` (uid, evmAddress, signCrt, signCsr, signKey, tlsCsr, tlsKey) VALUES 
('user1', '0x1234567890abcdef', '2023-01-01', 'csr_content_1', 'key_1', 'tls_csr_1', 'tls_key_1'),
('user2', '0xabcdef1234567890', '2023-01-02', 'csr_content_2', 'key_2', 'tls_csr_2', 'tls_key_2'),
('user3', '0x7890abcdef123456', '2023-01-03', 'csr_content_3', 'key_3', 'tls_csr_3', 'tls_key_3'),
('user4', '0x4567890abcdef1234', '2023-01-04', 'csr_content_4', 'key_4', 'tls_csr_4', 'tls_key_4');
UNLOCK TABLES;

-- Stored procedure for adding or editing users
CREATE PROCEDURE `usp_user_add_or_edit` (
    IN _id INT,
    IN _uid VARCHAR(255),
    IN _evmAddress TEXT,      
    IN _signCrt TEXT,        
    IN _signCsr TEXT,        
    IN _signKey TEXT,        
    IN _tlsCsr TEXT,         
    IN _tlsKey TEXT           
)
BEGIN
    IF _id = 0 THEN
        INSERT INTO users(uid, evmAddress, signCrt, signCsr, signKey, tlsCsr, tlsKey)
        VALUES (_uid, _evmAddress, _signCrt, _signCsr, _signKey, _tlsCsr, _tlsKey);
    ELSE
        UPDATE users
        SET uid = _uid,
            evmAddress = _evmAddress,
            signCrt = _signCrt,
            signCsr = _signCsr,
            signKey = _signKey,
            tlsCsr = _tlsCsr,
            tlsKey = _tlsKey
        WHERE id = _id;
    END IF;

    SELECT ROW_COUNT() AS affectedRows; 
END;