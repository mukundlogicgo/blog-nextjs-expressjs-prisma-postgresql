import { prisma } from "../../config/prisma.config.js";

/**
 * Create post
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const { userId: authorId } = req;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: Number(authorId),
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `Post created successfully`,
      data: post,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to create post. Please try again after some time",
    });
  }
};

/**
 * Get user's all posts
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getUserPosts = async (req, res) => {
  const { userId: authorId } = req;

  try {
    // find user's posts
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
        like: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        authorId: Number(authorId),
      },
    });

    // send user's posts  response
    return res.status(200).json({
      success: true,
      message: `Posts fetch successfully`,
      data: posts,
    });
  } catch (error) {
    console.log(`[ERROR] ${error.message}`);

    // send server error response
    return res.status(500).json({
      success: false,
      error: `Unable to create post. Please try after some time`,
    });
  }
};

/**
 * Get user's post by post id
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getUserPostById = async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const userId = Number(req.userId);

    // make sure that post id is provided
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: `PostId is required or invalid`,
      });
    }

    // find that post by id
    const post = await prisma.post.findFirst({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            commentReply: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        like: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      where: {
        id: postId,
        authorId: userId,
      },
    });

    // make sure post is found
    if (!post) {
      return res.status(404).json({
        success: true,
        message: `Post with id ${postId} not exist`,
        data: null,
      });
    }

    // send success response
    return res.status(200).json({
      success: true,
      message: "Post fetch successfully",
      data: post,
    });
  } catch (error) {
    console.log(`[ERROR] ${error.message}`);
    return res.status(500).json({
      success: true,
      error: "Internal server error",
    });
  }
};

/**
 * Make comment on any poster
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const createCommentOnPost = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const postId = Number(req.params.postId);

    const { content } = req.body;

    // make sure post is exist
    const post = await prisma.post.findFirst({ where: { id: postId } });

    if (!post) {
      return res.status(400).json({
        success: false,
        error: `Post with id ${postId} not exist`,
      });
    }

    // make sure content is not empty
    if (!content || !content?.trim()) {
      return res.status(400).json({
        success: false,
        error: `Content is required`,
      });
    }

    // create comment on post
    const comment = await prisma.comment.create({
      data: {
        userId,
        postId,
        content,
      },
    });

    // send success response
    return res.status(201).json({
      success: true,
      message: `Comment added successfully`,
      data: comment,
    });
  } catch (error) {
    console.log(error.message);
  }
};

/**
 *  Like a post (toggle like)
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const togglePostLike = async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const userId = Number(req.userId);

    // make sure post is exist
    const post = await prisma.post.findFirst({ where: { id: postId } });

    if (!post) {
      return res.status(400).json({
        success: false,
        error: `Post with id ${postId} not exist`,
      });
    }

    // check already liked or not
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    // if not liked then like post
    if (!existingLike) {
      await prisma.like.create({
        data: {
          postId: postId,
          userId: userId,
        },
      });

      // send success response
      return res.status(200).json({
        success: true,
        message: "Like added",
      });
    }

    // if already liked then remove it
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    // send success response
    return res.status(200).json({
      success: true,
      message: `Like removed`,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
