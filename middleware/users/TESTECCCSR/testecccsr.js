// const fs = require("fs");
// const path = require("path");
// const { exec } = require("child_process");

// const execSh = (command) =>
//   new Promise((resolve, reject) => {
//     exec(command, (err, stdout, stderr) => {
//       err ? reject(`Error: ${stderr}`) : resolve(stdout);
//     });
//   });

// const generateECCKeysAndCSRs = async () => {
//   const cmecccsrDir = __dirname;
//   const filesToRead = [
//     "user_ecc_sign.csr",
//     "user_ecc_sign.key",
//     "user_ecc_tls.csr",
//     "user_ecc_tls.key",
//   ];
//   const userData = {
//     uid: Date.now().toString(),
//     evmAddress: Date.now().toString(),
//     signCrt: Date.now().toString(),
//     signCsr: "",
//     signKey: "",
//     tlsCsr: "",
//     tlsKey: "",
//   };
//   try {
//     await execSh(`cd ${cmecccsrDir} && cmd /c ecccsr.bat`);
//     await Promise.all(
//       filesToRead.map(async (file) => {
//         const filePath = path.join(cmecccsrDir, file);
//         const content = fs.readFileSync(filePath, "utf-8");
//         console.log("StartRead");
//         console.log(`Contents of ${file}:`, content);
//         console.log("EndRead");
//         const fieldMap = {
//           "user_ecc_sign.csr": "signCsr",
//           "user_ecc_sign.key": "signKey",
//           "user_ecc_tls.csr": "tlsCsr",
//           "user_ecc_tls.key": "tlsKey",
//         };
//         if (fieldMap[file]) {
//           userData[fieldMap[file]] = content;
//         }
//         fs.unlinkSync(filePath);
//         console.log(`Deleted: ${file}`);
//       })
//     );
//     return userData;
//   } catch (error) {
//     console.error("Error generating ECC keys and CSRs:", error);
//   }
// };

// generateECCKeysAndCSRs()
//   .then((userData) => console.log("Generated User Data:", userData))
//   .catch((error) => console.error("Error:", error));



const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
    try {
        return execSync(command, { encoding: 'utf-8' }).trim();
    } catch (error) {
        console.error(`Error executing command: ${command}`, error.message);
        throw new Error(`Command failed: ${command}`);
    }
}

async function generateECCKeysAndCSR(type, uid) {
    if (!type || typeof type !== 'string' || !uid || typeof uid !== 'string') {
        throw new Error('Invalid type or uid provided for key generation.');
    }
    console.log(`Generating ${type} key and CSR for UID: ${uid}...`);    
    const keyContent = runCommand('openssl ecparam -name prime256v1 -genkey');
    const tempKeyFile = path.join(__dirname, `${type}_temp_key_${uid}.pem`);    
    try {
        fs.writeFileSync(tempKeyFile, keyContent);
        const csrContent = runCommand(`openssl req -batch -new -sha256 -key ${tempKeyFile} -subj "/CN=example.com"`);
        const pkcs8Content = runCommand(`openssl pkcs8 -topk8 -nocrypt -in ${tempKeyFile}`);
        return { 
            key: keyContent, 
            user_ecc_csr: csrContent, 
            user_ecc_key: pkcs8Content 
        };
    } catch (error) {
        console.error(`Error during key/CSR generation for ${type} and UID ${uid}:`, error.message);
        throw error;
    } finally {
        if (fs.existsSync(tempKeyFile)) {
            fs.unlinkSync(tempKeyFile);
        }
    }
}

(async () => {
    try {
        const userEccSign = generateECCKeysAndCSR('user_ecc_sign', '1234');
        const userEccTls = generateECCKeysAndCSR('user_ecc_tls', '1234');
        console.log({ userEccSign, userEccTls });
    } catch (error) {
        console.error('An error occurred during the generation process:', error.message);
    }
})();

module.exports = { generateECCKeysAndCSR };