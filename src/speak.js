const axios = require("axios");
const fs = require("fs");
var player = require("play-sound")((opts = {}));
const path = require("path");
const readLastLines = require("read-last-lines");
const { randomIntFromInterval } = require("./utils");
const { profile } = require("./profiles/default");
const { transcribe } = require("./transcribe");
const { randomIntFromInterval } = require("./lib/utils");
const UIDGenerator = require("uid-generator");
const util = require("util");

const textToSpeech = require("@google-cloud/text-to-speech");

const uidgen = new UIDGenerator();

const newclient = new textToSpeech.TextToSpeechClient({
  projectId: "jsonresume-registry", // config
});

const name = "People"; // config
const botName = "Omega";

const speak = () => {
  const stopSequence = ["\n", "People:", "Omega:"]; // config
  const initialPrompt = profile.prompt(name, botName);
  setTimeout(async () => {
    readLastLines
      .read(__dirname + "/../transcript.txt", 10)
      .then(async (lines) => {
        const text = initialPrompt + "\n" + lines + "Omega:";

        console.log({ text });
        try {
          const response = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: text,
            temperature: 0.8,
            max_tokens: 507,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: stopSequence,
          });

          if (response?.data?.choices[0].text === "") {
            // #todo - terrible truthiness
            return false;
          }

          const botThought = resp.data.choices[0].text.trim();

          var request = {
            input: {
              text: botThought,
            },
            ...profile,
          };

          // #todo - this needs the most attention, not hard to make this a ferrari
          const writeFile = await util.promisify(fs.writeFile);
          const uid = await uidgen.generate();

          const fuzzyRelevance = [];
          const ttttt = `Omega:${omegaSaid}\n`; // #todo - profile
          transcribe(ttttt); // personal note, side effects are bad ajax (this writes to THE file)
          // hope this cunt sounds alright, this is where it tries to speak, voicemeter banana will be your friend
          const [newresponse] = await newclient.synthesizeSpeech(request);
          const clipPath = path.join(__dirname, `../clips/${uid}.mp3`);
          await writeFile(clipPath, newresponse.audioContent, "binary");
          player.play(clipPath, async function (err) {
            console.log("barely played");
          });
        } catch (err) {
          // #todo - log an error here
          return false;
        }
      });

    speak();
    // }, 5000);
  }, randomIntFromInterval(70000, 90000));
  return;
};

process.on("unhandledRejection", (err) => {
  console.log("Speaking failed for unknown reason #todo");
  console.log(err);
  process.exitCode = 1;
  process.exit();
});

speak();
