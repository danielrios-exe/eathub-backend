import e, { Router, Request, Response } from 'express';
import PostService from '../services/post-service';
import Errors from '../errors/errors';
import AuthenticationService from '../services/authentication-service';
import CommentService from '../services/comment-service';

const router = Router();
const postService = new PostService();
const commentService = new CommentService();

router.post('/', async (req: Request, res: Response) => {
  try {
    const requestHeader: string = req.headers['authorization'] || '';
    const { isAuthorized } = await AuthenticationService.isAuthorized(
      requestHeader
    );

    if (!isAuthorized) {
      return res.status(401).send({ success: false, message: 'Unauthorized.' });
    }

    const post = await postService.create(req.body);
    res.send({ success: true, data: post });
  } catch (error) {
    if (error === Errors.INVALID_AUTH_HEADER) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.INVALID_TOKEN) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.FAILED_TO_CREATE_POST) {
      return res.status(500).send({ success: false, message: error });
    }

    res.status(500).send({ success: false, error: error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const requestHeader: string = req.headers['authorization'] || '';
    const { isAuthorized } = await AuthenticationService.isAuthorized(
      requestHeader
    );

    if (!isAuthorized) {
      return res.status(401).send({ success: false, message: 'Unauthorized.' });
    }

    const posts = await postService.get();
    res.send({ success: true, posts: posts });
  } catch (error) {
    if (error === Errors.INVALID_AUTH_HEADER) {
      return res.status(400).send({ success: false, message: error });
    }
    if (error === Errors.INVALID_TOKEN) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.NO_POSTS_FOUND) {
      return res.status(404).send({ success: false, message: error });
    }

    res.status(500).send({ success: false, error: error });
  }
});

router.post('/:id/comment', async (req: Request, res: Response) => {
  try {
    const requestHeader: string = req.headers['authorization'] || '';
    const isAuthorized = await AuthenticationService.isAuthorized(
      requestHeader
    );

    if (!isAuthorized) {
      return res.status(401).send({ success: false, message: 'Unauthorized.' });
    }

    const comment = await commentService.create(req.body, req.params.id);
    res.send({ success: true, data: comment });
  } catch (error) {
    if (error === Errors.INVALID_AUTH_HEADER) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.INVALID_TOKEN) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.FAILED_TO_ADD_COMMENT) {
      return res.status(500).send({ success: false, message: error });
    }

    res.status(500).send({ success: false, error: error });
  }
});

router.put('/:id/like', async (req: Request, res: Response) => {
  try {
    const requestHeader: string = req.headers['authorization'] || '';
    const isAuthorized = await AuthenticationService.isAuthorized(
      requestHeader
    );

    if (!isAuthorized) {
      return res.status(401).send({ success: false, message: 'Unauthorized.' });
    }

    const comment = await postService.like(req.params.id);
    res.send({ success: true, data: comment });
  } catch (error) {
    if (error === Errors.INVALID_AUTH_HEADER) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.INVALID_TOKEN) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.FAILED_TO_LIKE_POST) {
      return res.status(500).send({ success: false, message: error });
    }

    res.status(500).send({ success: false, error: error });
  }
});

router.put(
  '/:id/comment/:commentId/like',
  async (req: Request, res: Response) => {
    try {
      const requestHeader: string = req.headers['authorization'] || '';
      const isAuthorized = await AuthenticationService.isAuthorized(
        requestHeader
      );

      if (!isAuthorized) {
        return res
          .status(401)
          .send({ success: false, message: 'Unauthorized.' });
      }

      const comment = await commentService.like(
        req.params.id,
        req.params.commentId
      );
      res.send({ success: true, data: comment });
    } catch (error) {
      if (error === Errors.INVALID_AUTH_HEADER) {
        return res.status(401).send({ success: false, message: error });
      }
      if (error === Errors.INVALID_TOKEN) {
        return res.status(401).send({ success: false, message: error });
      }
      if (error === Errors.FAILED_TO_LIKE_POST) {
        return res.status(500).send({ success: false, message: error });
      }

      res.status(500).send({ success: false, error: error });
    }
  }
);

export default router;
