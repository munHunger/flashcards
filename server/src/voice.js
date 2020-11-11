const textToSpeech = require("@google-cloud/text-to-speech");

// Import other required libraries
const fs = require("fs");
const util = require("util");
// Creates a client
const client = new textToSpeech.TextToSpeechClient();

let enabled = false;
let path = "data";
process.argv.forEach((line) => {
  if (line.split("=")[0] === "voice") enabled = line.split("=")[1] == "true";
  if (line.split("=")[0] === "voicePath") path = line.split("=")[1];
});

async function voice(text, out) {
  if (!enabled) return;
  if (fs.existsSync(`${path}/voice/${text}.mp3`)) return;
  // Construct the request
  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: {
      languageCode: "ja-JP",
      name: "ja-JP-Wavenet-D",
      ssmlGender: "MALE",
    },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(`${path}/voice/${out}.mp3`, response.audioContent, "binary");
  console.log("generated voice " + text);
}

module.exports = { voice };
