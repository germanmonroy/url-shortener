const UrlModel = require("../models/url.model");
const { nanoid } = require("nanoid");

exports.getUrl = async (req, res) => {
  const { slug } = req.params;

  // check if slug exits
  const foundSlug = await UrlModel.findOne({ slug });

  // if no slug exits, create one
  if (!foundSlug || foundSlug.length == 0) {
    let fullUrl = req.protocol + "://" + req.get("Host") + req.originalUrl;
    res
      .status(404)
      .json({ message: "URL not found.", body: { slug, url: fullUrl } });
  } else {
    res.status(302).redirect(foundSlug.url);
  }
};

exports.postUrl = async (req, res) => {
  let { url, slug } = req.body
  
  // check if is slug provided, create new one if not
  if (!slug) {
    slug = nanoid(5);
  }

  slug = slug.toLocaleLowerCase()

  // check if slug exits
  const foundSlug = await UrlModel.find({ slug })

  // if no slug exits, create one
  if (!foundSlug || foundSlug.length == 0) {
    const newUrl = new UrlModel(
      {
        slug,
        url
      }
    )

    const response = await newUrl.save()
    res.status(200).json({ message: 'Creation successful!', body: response })
  } else {
    res.status(409).json({ message: 'Resource already exits.', body: { slug: "", url: "" }})
  }
}
