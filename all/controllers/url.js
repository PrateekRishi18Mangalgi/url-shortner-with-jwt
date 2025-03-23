const URL = require('../models/url');
const {nanoid} = require('nanoid');


async function handleCreateShortUrl(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'url is required' });
    const shortId = nanoid(8);
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visithistory: [],
        createdBy: req.user._id,
    });
    const urls = await URL.find({createdBy: req.user._id});
    return res.render("home", {
        id: shortId,
        urls: urls,
      });
}


async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({
        totalClicks: result.visithistory.length,
        analytics: result.visitHistory,

    });
}

module.exports = {
    handleCreateShortUrl,
    handleGetAnalytics,
    
}

