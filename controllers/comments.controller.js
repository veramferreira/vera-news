const { getCommentAndDelete } = require("../models/comments.model");

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params;

    getCommentAndDelete(comment_id).then(() => {
        res.status(204).send({ msg: 'comment deleted!'})
    })
    .catch((err) => {
        next(err)
    })
}