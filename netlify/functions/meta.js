const cheerio = require("cheerio");
const fetch = require("node-fetch");

exports.handler = async function(event) {
  const url = event.queryStringParameters.url;

  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const getMetatag = (name) =>
    $(`meta[name=${name}]`).attr("content") ||
    $(`meta[property="og:${name}"]`).attr("content") ||
    $(`meta[property="twitter:${name}"]`).attr("content");

  return {
    statusCode: 200,
    body: JSON.stringify({
      title: $("title").text(),
      favicon: $('link[rel="shortcut icon"]').attr("href"),
      description: getMetatag("description"),
      image: getMetatag("image"),
      author: getMetatag("author"),
    }),
  };
};
