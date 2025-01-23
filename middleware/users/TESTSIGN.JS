// const crypto = require("crypto");

// const PRIVATE_KEY = "PRIVATEKEY1234567";

// const generateSignature = (data) => {
//   return crypto
//     .createHmac("sha256", PRIVATE_KEY)
//     .update(JSON.stringify(data))
//     .digest("hex");
// };

// const logSignature = (data) => {
//   const hash = generateSignature(data);
//   console.log(`Signature: ${hash} (Data: ${JSON.stringify(data)})`);
// };

// const withData = { key: "value" };
// const withoutData = {};

// logSignature(withData);
// logSignature(withoutData);

const { kmsEncrypt } = require("./kmsencryption");

const generateSignature = async (data) => {
  const encryptedData = await kmsEncrypt(JSON.stringify(data));
  return Buffer.from(encryptedData, "base64").toString("hex");
};

const logSignature = async (data) => {
  try {
    const hash = await generateSignature(data);
    console.log(`Signature: ${hash} (Data: ${JSON.stringify(data)})`);
  } catch (error) {
    console.error("Error generating signature:", error);
  }
};

const withData = { key: "value" };
const withoutData = {};
const stringdata = "HelloWorld";

(async () => {
  await logSignature(withData);
  await logSignature(withoutData);
  await logSignature(stringdata);
})();
