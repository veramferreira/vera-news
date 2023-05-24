const db = require("../db/connection");

exports.getCommentAndDelete = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found!" });
      } else {
        return db.query(`DELETE FROM comments WHERE comment_id = $1`, [id]);
      }
    });
};
