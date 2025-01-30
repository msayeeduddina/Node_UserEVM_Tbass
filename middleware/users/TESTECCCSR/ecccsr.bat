@echo off
REM Generate user ECC sign key and CSR
openssl ecparam -name prime256v1 -genkey -out temp
openssl req -batch -config openssl_user.cnf -key temp -new -sha256 -out user_ecc_sign.csr
openssl pkcs8 -topk8 -in temp -nocrypt -out user_ecc_sign.key

REM Generate user ECC TLS key and CSR
openssl ecparam -name prime256v1 -genkey -out temp
openssl req -batch -config openssl_user.cnf -key temp -new -sha256 -out user_ecc_tls.csr
openssl pkcs8 -topk8 -in temp -nocrypt -out user_ecc_tls.key
