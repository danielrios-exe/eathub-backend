enum Errors {
  INTERNAL_ERROR = 'Internal error',
  NO_MEAL_TYPES_FOUND = 'No meal types found',
  NO_USER_FOUND = 'No user found',
  INVALID_AUTH_HEADER = 'Invalid authorization header',
  USER_ALRADY_IN_DB = 'User already in database',
  USER_NOT_CREATED = 'User not created',
  FAILED_TO_CREATE_POST = 'Failed to create post',
  INVALID_TOKEN = 'Invalid token',
  NO_POSTS_FOUND = 'No posts found',
  FAILED_TO_ADD_COMMENT = 'Failed to add comment',
  FAILED_TO_LIKE_POST = 'Failed to like post',
  FAILED_TO_LIKE_COMMENT = 'Failed to like comment',
  FAILED_TO_CREATE_REVIEW = 'Failed to create review',
  NO_REVIEWS_FOUND = 'No reviews found',
  FAILED_TO_CREATE_MENU = 'Failed to create menu',
  NO_MENU_DETAILS_FOUND = 'No menu details found',
}

export default Errors;
