import { prisma } from "../../config/prisma.config.js";

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req;

    // find user profile
    const user = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    // remove user password before send response
    delete user.password;

    // send success response
    return res.status(200).json({
      success: true,
      message: "Profile fetch successfully",
      data: user,
    });
  } catch (error) {}
};

// export const getAllUser = async (req, res) => {
//   try {
//     const user = await prisma.user.findMany({
//       include: {
//         post: {
//           include: {
//             comment: {
//               select: {
//                 content: true,
//                 createdAt: true,
//                 user: {
//                   select: {
//                     email: true,
//                     name: true,
//                   },
//                 },
//               },
//             },
//             like: {
//               select: {
//                 user: {
//                   select: {
//                     email: true,
//                     name: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });
//     res.json({
//       data: user,
//     });
//   } catch (error) {
//     console.log(error.message);

//     res.status(500).json({
//       success: false,
//       error: "Internal server error",
//     });
//   }
// };
