const fs = require("fs");
var player = require("play-sound")((opts = {})); // bad
const { Configuration, OpenAIApi } = require("openai");
const path = require("path");
const readLastLines = require("read-last-lines");
const UIDGenerator = require("uid-generator");
const util = require("util");
const { transcribe } = require("./transcribe");
const { profile } = require("./profiles/Omega");

const uidgen = new UIDGenerator();
const configuration = new Configuration({
  // config
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

// # todo - yet another ugly recursive function, #notmyproblem
const images = () => {
  setTimeout(async () => {
    readLastLines
      .read(__dirname + "/../transcript.txt", 12) // config
      .then(async (lines) => {
        // lines is a new line delimited string of shit (the transcription of those you are engaging with)
        const paintingQuestion = `Describe the following conversation's major thematic elements in terms of a visual description of the content in the form of a painting;

Conversation:

${lines}
Description:`;
        // #todo - empty strings are a bad source of "truth"
        let paintingIdea = "";
        try {
          const response = await openai.createCompletion({
            // config
            model: "text-davinci-002",
            prompt: paintingQuestion,
            temperature: 0.8,
            max_tokens: 507,
            top_p: 1,
            frequency_penalty: 0.35,
            presence_penalty: 0,
          });
          // #todo - this is horrendous
          paintingIdea = response.data.choices[0].text;
        } catch (e) {
          // #todo - learn how to handle errors lol
          console.log("========", e.response.data.error);
          // ## might as well exit, the process manager should handle it
          process.exit();
        }

        // #todo - assuming truthiness makes one decline, thus we sit upright
        if (paintingIdea) {
          paintingIdea = paintingIdea.replace("\n", "").trim(); // #todo - new lines suck, like change
          try {
            // #todo - the following is disgusting
            // synchronous reads of a file that can be infinite
            // learn to truncate and be a better person
            const response = await openai.createImage({
              // config
              prompt: paintingIdea,
              n: 1,
              size: "1024x1024",
            });

            // #todo - who is going to handle these errors, lol, assumption based programming will take you far
            const imageRes = response.data;

            // @todo - create file if it doesn't exist
            const imagesFile = fs.readFileSync(
              path.join(__dirname + "data/images.json"),
              "utf8"
            );

            const imagesArray = JSON.parse(imagesFile);

            imagesArray.push({
              paintingIdea: paintingIdea,
              imageUrls: imageRes.data.map((i) => i.url),
              lines: lines,
            });

            fs.writeFileSync(
              path.join(__dirname + "data/images.json"),
              JSON.stringify(imagesArray, undefined, 4) // que
            );
          } catch (e) {
            console.log("==========", e.response.data.error); // que cosa
          }
        } else {
          console.log(
            "Couldn't think of a painting, fix your parameters, or speak better"
          );
        }
      });

    images();
  }, 30000); // config
  return;
};

process.on("unhandledRejection", (err) => {
  console.log("Images failed, likely for a lot of reasons");
  console.log(err);
  process.exitCode = 1;
  process.exit();
});

images();
