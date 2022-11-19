const recorder = require("node-record-lpcm16");
const speech = require("@google-cloud/speech");
const { transcribe } = require("./transcribe");

// #todo - this bot can't tell voices apart, this triggers it to be conversational
const FAKE_LISTENERS = ["People", "Lisa", "Ajax"]; //config

function listen() {
  // #todo - configure this if you give a shit
  const voiceConfig = {
    // config
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  const request = {
    config: voiceConfig,
    interimResults: false, // #todo - one sweet day, super power, brings a stream of arrays of everything people say
  };

  const client = new speech.SpeechClient();

  const recognizeStream = client
    .streamingRecognize(request)
    .on("error", (e) => {
      console.log("===========", e);
      process.exit();
    })
    .on("data", (data) => {
      const randomFakeListener =
        FAKE_LISTENERS[Math.floor(Math.random() * FAKE_LISTENERS.length)];
      // #todo - make the below less shit
      transcribe(
        `${randomFakeListener}:${data.results[0].alternatives[0].transcript.trim()}\n`
      );
      return true;
    });

  recorder
    .record({
      //config
      sampleRateHertz: voiceConfig.sampleRateHertz,
      threshold: 0.4, // #todo - silence threshold, god knows what this means, find the right floating point
      recordProgram: "rec",
      silence: "0.1", // #todo - as above, hard to get a good value, this in seconds before it thinks people stop talking
    })
    .stream()
    .on("error", (e) => {
      console.log("===========", e);
      process.exit();
    })
    .pipe(recognizeStream);

  console.log("Listening, press Ctrl+C to stop.");
}

process.on("unhandledRejection", (err) => {
  console.log("Something completely broke, this is going to restart it");
  process.exit();
});
setInterval(() => {
  process.exit();
  // #todo - This just restarts the listening bot at some point, cause listening is hard
}, 240000); //config
listen();
