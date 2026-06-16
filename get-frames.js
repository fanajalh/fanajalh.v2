const http = require("https");

const url = "https://cdn.jsdelivr.net/gh/fanajalh/img/frame2.png";

http.get(url, function (response) {
  const chunks = [];
  response.on('data', function (chunk) {
    chunks.push(chunk);
  }).on('end', function() {
    const buffer = Buffer.concat(chunks);
    try {
      // Check PNG signature
      if (buffer.readUInt32BE(0) === 0x89504E47 && buffer.readUInt32BE(4) === 0x0D0A1A0A) {
        // Read IHDR chunk
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        console.log("PNG Dimensions: width =", width, "height =", height);
      } else {
        console.error("Not a valid PNG file");
      }
    } catch (e) {
      console.error("Failed to parse PNG header:", e);
    }
  });
});
