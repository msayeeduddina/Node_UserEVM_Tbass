require("dotenv").config({ path: "../../.env" });
const tencentcloud = require("tencentcloud-sdk-nodejs");

const KmsClient = tencentcloud.kms.v20190118.Client;
const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: process.env.KMS_REGION,
  profile: {
    httpProfile: {
      endpoint: "kms.tencentcloudapi.com",
    },
  },
};
const client = new KmsClient(clientConfig);

async function kmsEncrypt(plaintext) {
  const params = {
    KeyId: process.env.KMS_KEY_ID,
    Plaintext: Buffer.from(plaintext).toString("base64"),
  };
  try {
    const { CiphertextBlob: encryptedText } = await client.Encrypt(params);
    console.log("Encrypted Text:", encryptedText);
    return encryptedText;
  } catch (error) {
    console.error("Error during encryption:", error);
    throw new Error("Encryption failed");
  }
}

async function kmsDecrypt(encryptedText) {
  const decryptedParams = { CiphertextBlob: encryptedText };
  try {
    const { Plaintext } = await client.Decrypt(decryptedParams);
    const decryptedText = Buffer.from(Plaintext, "base64").toString("utf-8");
    console.log("Decrypted Text:", decryptedText);
    return decryptedText;
  } catch (error) {
    console.error("Error during decryption:", error);
    throw new Error("Decryption failed");
  }
}

////Test
async function TencentKMSTest() {
  try {
    const plaintext = "HelloWorld";
    const encryptedText = await kmsEncrypt(plaintext);
    const decryptedText = await kmsDecrypt(encryptedText);
    return { ok: true, decryptedText };
  } catch (error) {
    console.error("Error during KMS operations:", error);
    return { ok: false, error };
  }
}
// TencentKMSTest().then((result) => {
//   console.log("Result:", result);
// });
////Test

module.exports = {
  kmsEncrypt,
  kmsDecrypt,
};