import { Admin, File, User } from "@lib/models";
import { NextResponse } from "next/server";

// POST handler for report submission
// export async function POST(request) {
//     try {
//         // await new Promise((resolve) => setTimeout(resolve, 2000));

//         const body = await request.json(); // Parse the request body

//         // Create new report in the database
//         const admin = await Admin.create({
//             first_name: body.first_name || null,
//             last_name: body.last_name || null,
//             gender: body.gender || null,
//             email: body.email || null,
//             password: body.password || null,
//         });

//         return NextResponse.json(
//             { success: true, message: "New admin user", details: admin },
//             { status: 200 }
//         );
//     } catch (error) {
//         // console.error("Error handling report submission:", error.errors);

//         // Handle Sequelize validation errors
//         if (
//             error.name === "SequelizeValidationError" ||
//             error.name === "SequelizeUniqueConstraintError"
//         ) {
//             const validationErrors = error.errors.map((err) => {
//                 if (error.name === "SequelizeUniqueConstraintError") {
//                     return `${err.path} already exists!`;
//                 } else {
//                     return err.message;
//                 }
//             });

//             return NextResponse.json(
//                 {
//                     error: true,
//                     message: "Validation failed",
//                     details: validationErrors,
//                 },
//                 { status: 400 }
//             );
//         }

//         return NextResponse.json(
//             { error: true, message: "Failed to submit report." },
//             { status: 500 }
//         );
//     }
// }

export async function GET() {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        const users = await User.findAll({
            attributes: ["id", "name", "email"],
            // include: [
            //     {
            //         model: Role,
            //         as: "role",
            //         attributes: ["role_name"]
            //     }
            // ]
        });
        return NextResponse.json({ users }, { status: 200 });

    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve admins.",
                details: error,
            },
            { status: 500 }
        );
    }
}
