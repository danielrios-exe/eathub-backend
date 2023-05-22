import pool from '../db/Database';
import Errors from '../errors/errors';

interface Comment {
  id: number;
  text: string;
  likes_count?: number;
  created_at?: Date;
  user_id: number;
  post_id: number;
}

class CommentService {
  async create(comment: Comment, postId: string) {
    const commentRequest = await pool.query(
      `insert into "comment" ` +
        `("text", likes_count, created_at, user_id, post_id) ` +
        `values ('${comment.text}', 0, now(), ${comment.user_id}, ${postId})`
    );
    const rowCount = commentRequest.rowCount;

    if (rowCount === 0) {
      throw Errors.FAILED_TO_ADD_COMMENT;
    }

    return;
  }

  async like(postId: string, id: string) {
    const commentRequest = await pool.query(
      `update "comment" set likes_count = likes_count + 1 where id = ${id} and ` +
        `post_id = ${postId}`
    );
    const rowCount = commentRequest.rowCount;

    if (rowCount === 0) {
      throw Errors.FAILED_TO_LIKE_COMMENT;
    }

    return;
  }
}

export default CommentService;
