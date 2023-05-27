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

class RestaurantService {
  /**
   * Fetches all restaurants.
   * Used on restaurant page.
   * @returns
   */
  async get() {
    const request = await pool.query(
      'select u.id, u.username, count(md.*) "details_count", count(r2.*) "review_count" ' +
        'from "user" u ' +
        'left join review r2 on u.id = r2.reviewee_id ' +
        'join menu m on u.id = m.restaurant_id ' +
        'join menu_detail md on m.id = md.menu_id ' +
        'join "role" r on u.role_id = r.id ' +
        'where r."name" = \'Restaurant\' ' +
        'group by u.id'
    );
    const rowCount = request.rowCount;

    if (rowCount === 0) {
      throw Errors.NO_RESTAURANTS_FOUND;
    }

    console.log('request.rows', request.rows);
    return request.rows;
  }
}

export default RestaurantService;
