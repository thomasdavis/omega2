const express = require("express");
const fs = require("fs");

const app = express();

/*
# todo
- This script is just a basic renderer
- Do whatever you want with the ./data
*/

app.get("/", function (req, res) {
  // @todo - write the file if it doesn't exist
  const imagesContents = fs.readFileSync(
    __dirname + "\\..\\data\\images.json",
    "utf8"
  );
  const lastImagesArray = JSON.parse(imagesContents);
  const images = lastImagesArray.reverse().slice(0, 12); // config
  const html = `
<html>
  <body>
    <h1>New images sometimes, you have to refresh the page</h1>
    <i>Credits: Lisa Watts</i>

    ${images.map((i) => {
      return `
        <h3>${i.paintingIdea}</h3>
        <div style="font-size: 12; font-style: italic;">Transcription: ${
          i.lines
        }</div>
        <div>
    ${i.imageUrls.map((image) => {
      return `<img src="${image}" />`;
    })}
    </div>
    `;
    })}
  </body>

</html>
  `;
  res.send(html);
});

app.listen(3000); // config
