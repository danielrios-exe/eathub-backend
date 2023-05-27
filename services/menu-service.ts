import pool from '../db/Database';
import Errors from '../errors/errors';
import PostService, { Post } from './post-service';

interface Menu {
  id: number;
  title: string;
  subtitle: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  restaurant_id: number;
  menu_details: MenuDetail[];
}

interface MenuDetail {
  id: number;
  name: string;
  price: number;
  menu_id: number;
  meal_type: string;
  meal_type_id: number;
}

class MenuService {
  /**
   * Creates a single post.
   */
  async create(menu: Menu) {
    const requestString =
      `insert into menu (title, subtitle, start_date, ` +
      `end_date, created_at, restaurant_id) ` +
      `values ('${menu.title}', ` +
      `'${menu.subtitle}', ` +
      `'${menu.start_date}', ` +
      `'${menu.end_date}', ` +
      `now(), ` +
      `${menu.restaurant_id}) ` +
      `returning id`;
    const menuRequest = await pool.query(requestString);
    let rowCount = menuRequest.rowCount;

    if (rowCount === 0) {
      throw Errors.FAILED_TO_CREATE_MENU;
    }

    const menuId = menuRequest.rows[0].id;

    // Create menu details
    menu.menu_details.forEach(async (menuDetail) => {
      const menuDetailRequest = await pool.query(
        `insert into menu_detail (name, price, menu_id) values ` +
          `('${menuDetail.name}', ${menuDetail.price}, ${menuId}) ` +
          `returning id`
      );
      rowCount = menuDetailRequest.rowCount;

      if (rowCount === 0) {
        throw Errors.FAILED_TO_CREATE_MENU;
      }

      const menuDetailId = menuDetailRequest.rows[0].id;
      const detailMealTypeQuery = await pool.query(
        `insert into menu_detail_meal_type (menu_detail_id, meal_type_id) ` +
          `values (${menuDetailId}, ${menuDetail.meal_type_id})`
      );
      rowCount = detailMealTypeQuery.rowCount;

      if (rowCount === 0) {
        throw Errors.FAILED_TO_CREATE_MENU;
      }
    });

    // Create a post to share the menu
    const postService = new PostService();
    const defaultPost: Post = {
      text: '¡Echa un vistazo a nuestro nuevo menú!',
      userId: menu.restaurant_id,
      images: [],
    };
    const post = await postService.create(defaultPost);

    return;
  }

  /**
   * Fetches the menu of the specified restaurant.
   * Used on feed page.
   * @returns
   */
  async get(restaurant_id: string) {
    const menuRequest = await pool.query(
      `select m.*, u.username  from menu m ` +
        `join "user" u on m.restaurant_id = u.id ` +
        `where m.restaurant_id = ${restaurant_id}`
    );
    const rowCount = menuRequest.rowCount;

    if (rowCount === 0) {
      throw Errors.NO_POSTS_FOUND;
    }

    const menu = { ...menuRequest.rows[0] };

    // Get menu details
    const menuDetailsRequest = await pool.query(
      `select md.*, mtc."name" as meal_type from menu_detail md ` +
        `join menu_detail_meal_type mdmt on md.id = mdmt.menu_detail_id ` +
        `join meal_type_catalogue mtc on mdmt.meal_type_id = mtc.id ` +
        `where menu_id = ${menu.id}`
    );
    const rowCountMenuDetails = menuDetailsRequest.rowCount;

    if (rowCountMenuDetails === 0) {
      throw Errors.NO_MENU_DETAILS_FOUND;
    }

    menu.menu_details = [...menuDetailsRequest.rows];

    return menu;
  }
}

export default MenuService;
