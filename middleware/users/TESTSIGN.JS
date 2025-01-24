const { kmsEncrypt } = require("./kmsEncryption");

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

const testValidateEndpoint = async (signature, data) => {
  const origin = "http://localhost:3000";
  try {
    const response = await fetch(`http://localhost:3000/api/users/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify({ data, signature }),
    });
    const textResponse = await response.text();
    console.log("Response Status:", response.status);
    console.log("Raw Response Body:", textResponse);
    if (response.ok) {
      const responseData = JSON.parse(textResponse);
      console.log("Validation successful:", responseData);
    } else {
      console.error("Error:", textResponse);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};

const withData = { key: "value" }; //{ key: "value" }
const withevokeData = {
  data: {
    contractAddress: "0cf86b19835383a1e8667eecb6a26553fbfce532",
    contractName: "testDRCPass1",
    methodName: "updateUserDetails",
    contractArgs: [
      "0x2e00c7ae7c0883d3dfb7b8a6d589b75bb62bea70",
      "e19233609609d447861456ff7e77e7ac",
      "4fd082400bbef78c358fd82d6c0339fd",
      "353fc4463d677e534d82ab5e66bd8ff05fa3be20689be91838bc638a92c0c2de",
      "4a01d2282d4fc59756c80853db43f6d6",
      "f5c7f6db2331f60fc176ce076bdb2423aaccd379cdd6ca73be7486cf9a4a2f0f",
      1,
    ],
    contractOwner: { uid: "554538" },
    useContractJson: [],
  },
};
const withoutData = {};
const stringData = "HelloWorld";
const signature =
  "7c7221d2cb6c259c772ba39858fc26d2354e2774f223db8f340441d37d9a980fe11578a11894ccb0cc63b7b3e1d7d299c4e8554ac09fc99e3f471a69b1e82491";

(async () => {
  await Promise.all([
    logSignature(withData),
    logSignature(withevokeData),
    logSignature(withoutData),
    logSignature(stringData),
  ]);
  await testValidateEndpoint(signature, withoutData);
})();
