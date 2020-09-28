const { Router } = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const Link = require("../index").Link;

const router = Router();

router.get("/bookmarks", async (req, res) => {
  const links = await Link.findAll();
  res.status(200).json(links);
});

router.post("/bookmarks", async (req, res) => {
  const { title, description, url, image, tags } = req.body;

  if (image) {
    var img = image;
  } else {
    var img = "/default.jpg";
  }

  const link = await Link.create({
    title,
    description,
    url,
    image: img
  });

  res
    .status(200)
    .json({ status: "success", message: "added a bookmark", data: link });
});

router.post("/bookmarks/scrape", async (req, res) => {
  if (!req.body.url) {
    return res.status(404).json({ status: "error", message: "enter a url" });
  }

  try {
    const { data } = await axios.get(req.body.url, { timeout: 1000 * 5 });

    var resObj = {};

    $ = cheerio.load(data);
    $title = $("head title").text();
    $desc = $('meta[name="description"]').attr("content");
    $kwd = $('meta[name="keywords"]').attr("content");
    $ogTitle = $('meta[property="og:title"]').attr("content");
    $ogImage = $('meta[property="og:image"]').attr("content");

    if ($title) {
      resObj.title = $title;
    }

    if ($desc) {
      resObj.description = $desc;
    }

    if ($kwd) {
      resObj.keywords = $kwd;
    }

    if ($ogImage && $ogImage.length) {
      resObj.ogImage = $ogImage;
    }

    if ($ogTitle && $ogTitle.length) {
      resObj.ogTitle = $ogTitle;
    }

    //   const link = await Link.create({
    //     title,
    //     description,
    //     url,
    //     image
    //   });
    res.status(200).json(resObj);
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: "error", message: "url not found" });
  }
});

module.exports = router;
