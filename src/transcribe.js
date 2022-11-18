const fs = require("fs");
const path = require("path");

const transcribe = (transcription) => {
  console.log("./transcribe", transcription);
  console.log({ transcription });
  if (transcription !== "") {
    // #todo - terrible
    fs.appendFile(__dirname + "/../transcript.txt", transcription, () => {});
  }
};

module.exports.transcribe = transcribe;
