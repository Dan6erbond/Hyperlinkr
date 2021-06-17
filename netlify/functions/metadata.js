const { parser } = require("html-metadata-parser");

exports.handler = async function(event) {
  const url = event.queryStringParameters.url;

  const {
    meta: { title, description },
    og: { images: ogImages },
    images,
  } = await parser(url);

  let image;
  if (ogImages.length) {
    image = ogImages[0];
  } else if (images.length) {
    image = images[0];
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      title,
      description,
      image,
    }),
  };
};
