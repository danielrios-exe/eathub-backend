import pool from '../db/Database';
import Errors from '../errors/errors';

class MealTypeService {
  /**
   * Gets all the meal types.
   * This service is used when creating a menu.
   */
  async get() {
    const request = await pool.query('SELECT * FROM meal_type');
    const rowCount = request.rowCount;

    /**
     * Meal types are needed to create a menu.
     * If there are no meal types, then the menu cannot be created.
     */
    if (rowCount === 0) {
      throw new Error(Errors.NO_MEAL_TYPES_FOUND);
    }

    return request.rows;
  }
}

export default MealTypeService;
