import pool from '../db/Database';
import Errors from '../errors/errors';

interface Review {
  id: number;
  text: string;
  stars: string;
  created_at: Date;
  reviewer_id: number;
  reviewee_id: number;
}

class ReviewService {
  /**
   * Creates a single review.
   */
  async create(review: Review) {
    const reviewRequest = await pool.query(
      `insert into review (text, stars, created_at, reviewer_id, reviewee_id) ` +
        `values ('${review.text}', ` +
        `'${review.stars}', ` +
        `now(), ` +
        `${review.reviewer_id}, ` +
        `${review.reviewee_id})`
    );
    let rowCount = reviewRequest.rowCount;

    if (rowCount === 0) {
      throw Errors.FAILED_TO_CREATE_REVIEW;
    }

    return;
  }

  /**
   * Fetches all posts.
   * Used on feed page.
   * @returns
   */
  async get(user_id: string, type: string) {
    let queryString = '';
    if (type === 'reviewer') {
      queryString = `select * from review where reviewer_id = ${user_id}`;
    } else {
      queryString = `select * from review where reviewee_id = ${user_id}`;
    }

    const reviewssRequest = await pool.query(queryString);
    const rowCount = reviewssRequest.rowCount;

    if (rowCount === 0) {
      throw Errors.NO_REVIEWS_FOUND;
    }

    return reviewssRequest.rows;
  }
}

export default ReviewService;
