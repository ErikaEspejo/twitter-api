const Tweet = require('./model');

const list = (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  Tweet.find({}, ['likes', 'content', 'createdAt', 'user', 'comments'])
    .populate('user', ['name', 'username'])
    .populate('comments.user', ['name', 'username'])
    .limit(parseInt(limit, 10))
    .skip(skip)
    .sort({ createdAt: -1 })
    .then(async (tweets) => {
      const total = await Tweet.estimatedDocumentCount();
      const totalPages = Math.round(total / limit);
      const hasMore = page < totalPages;

      res.status(200).json({
        total,
        currentPage: page,
        totalPages,
        hasMore,
        data: tweets,
      });
    });
};

const create = (req, res) => {
  const { content, userId } = req.body;

  const tweet = {
    content,
    user: userId,
  };

  const newTweet = new Tweet(tweet);
  newTweet.save().then((tweetCreated) => {
    res.status(200).json(tweetCreated);
  });
};

const createComment = (req, res) => {
  const { comment, tweetId, userId } = req.body;

  const comments = {
    comment,
    user: userId,
  };

  Tweet.updateOne({ _id: tweetId }, { $addToSet: { comments } })
    .then(() => {
      res.status(200).json({ message: 'ok' });
    })
    .catch(() => {
      res.status(500).json({ message: 'no actualizado' });
    });
};

const likes = (req, res) => {
  const { tweetId } = req.body;

  Tweet.updateOne({ _id: tweetId }, { $inc: { likes: 1 } })
    .then(() => {
      res.status(200).json({ message: 'ok' });
    }).catch(() => {
      res.status(500).json({ message: 'no actualizado' });
    });
};

module.exports = {
  list, create, createComment, likes,
};
