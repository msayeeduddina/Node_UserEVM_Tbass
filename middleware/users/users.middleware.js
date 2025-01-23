// const crypto = require("crypto");

// const allowedDomains = [
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "http://localhost:9010",
// ];
// const privateKey = "PRIVATEKEY1234567";

// const verifySignature = (req, res, next) => {
//   try {
//     const { signature } = req.body;
//     const data = req.body.data || {};
//     const origin = req.headers.origin;
//     const ipAddress = req.ip || req.connection.remoteAddress;
//     console.log(`Allowed Domains: ${origin} and IP: ${ipAddress}`);
//     if (!allowedDomains.includes(origin)) {
//       return res.status(403).json({ message: "Domain not allowed" });
//     }
//     const hash = crypto
//       .createHmac("sha256", privateKey)
//       .update(JSON.stringify(data))
//       .digest("hex");
//     if (hash !== signature) {
//       return res.status(401).json({ message: "Invalid signature" });
//     }
//     next();
//   } catch (error) {
//     console.error("Error in verifySignature middleware:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = verifySignature;

const { kmsEncrypt } = require("./kmsencryption");

const allowedDomains = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:9010",
];

const verifySignature = async (req, res, next) => {
  try {
    const { signature } = req.body;
    const data = req.body.data || {};
    const origin = req.headers.origin;
    const ipAddress = req.ip || req.connection.remoteAddress;
    console.log(`Allowed Domains: ${origin} and IP: ${ipAddress}`);
    if (!allowedDomains.includes(origin)) {
      return res.status(403).json({ message: "Domain not allowed" });
    }
    const encryptedHash = await kmsEncrypt(JSON.stringify(data));
    const encryptedHashHex = Buffer.from(encryptedHash, "base64").toString(
      "hex"
    );
    if (encryptedHashHex !== signature) {
      return res.status(401).json({ message: "Invalid signature" });
    }
    next();
  } catch (error) {
    console.error("Error in verifySignature middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = verifySignature;
