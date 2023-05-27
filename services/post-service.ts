import pool from '../db/Database';
import Errors from '../errors/errors';

export interface Post {
  id?: number;
  text: string;
  likes_count?: number;
  created_at?: Date;
  userId: number;
  images: Image[];
}

interface Image {
  id?: number;
  url: string;
  post_id?: number;
}

interface Comment {
  id: number;
  text: string;
  likes_count?: number;
  created_at?: Date;
  user_id: number;
  post_id: number;
}

class PostService {
  /**
   * Creates a single post.
   */
  async create(post: Post) {
    const postRequest = await pool.query(
      `insert into post (text, likes_count, created_at, user_id) ` +
        `values ('${post.text}', ` +
        `0, ` + // Always start with 0 likes
        `now(), ` + // Always start with current server date
        `${post.userId}) ` +
        `returning id`
    );
    let rowCount = postRequest.rowCount;

    if (rowCount === 0) {
      throw Errors.FAILED_TO_CREATE_POST;
    }

    const postId = postRequest.rows[0].id;
    let imageRequestString = `insert into image (url, post_id) values`;

    // Append url values to the query string
    post.images.forEach((image: Image, index) => {
      if (index === post.images?.length - 1) {
        imageRequestString += ` ('${image.url}', ${postId})`;
      } else {
        imageRequestString += ` ('${image.url}', ${postId}),`;
      }
    });

    if (post.images.length > 0) {
      const imageRequest = await pool.query(imageRequestString);
      rowCount = imageRequest.rowCount;

      if (rowCount === 0 && post.images.length > 0) {
        throw Errors.FAILED_TO_CREATE_POST;
      }
    }

    return;
  }

  /**
   * Fetches all posts.
   * Used on feed page.
   * @returns
   */
  async get() {
    const postsRequest = await pool.query(
      'select p.*, u.username, u."name", u.last_name from post p ' +
        'join "user" u on p.user_id = u.id order by p.created_at desc limit(10)'
    );
    const rowCount = postsRequest.rowCount;

    if (rowCount === 0) {
      throw Errors.NO_POSTS_FOUND;
    }

    const posts: Post[] = [];
    for (let it = 0; it < postsRequest.rows.length; it++) {
      const post = postsRequest.rows[it];

      // Fetch images
      const imagesRequest = await pool.query(
        `select * from image where post_id = ${post.id}`
      );

      // Update object
      post.images = imagesRequest.rows;

      // Fetch comments
      const commentsRequest = await pool.query(
        `select c.*, u.username, u."name", u.last_name from comment c ` +
          `join "user" u on c.user_id = u.id ` +
          `where post_id = ${post.id}`
      );

      // Update object
      post.comments = commentsRequest.rows;

      // Add updated object to array
      posts.push(post);
    }

    return posts;
  }

  async addComment(comment: Comment, postId: string) {
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

  async like(postId: string) {
    const commentRequest = await pool.query(
      `update "post" set likes_count = likes_count + 1 ` +
        `where id = ${postId}`
    );
    const rowCount = commentRequest.rowCount;

    if (rowCount === 0) {
      throw Errors.FAILED_TO_LIKE_POST;
    }

    return;
  }
}

export default PostService;
