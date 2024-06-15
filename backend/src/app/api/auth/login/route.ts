import { query } from "@/app/config/db";
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
// JWT secret for signing tokens
const JWT_SECRET = "SecurityInsure";

// Define the expected data structure for a user account
interface UserAccount extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password: string;
}

// Define a type for the expected request payload
interface UserAccountRequest {
    email: string;
    password: string;
}

// Define a type for the response data
interface ApiResponse {
    status: number;
    message: string;
    data?: any; // Data is optional and can be of any type
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { email, password }: UserAccountRequest = await request.json();
        console.log("1")
        if (email && password) {
            const checkUserExistence = (await query({
                query: 'SELECT * FROM user_accounts WHERE email = ?',
                values: [email],
            })) as UserAccount[];

            const storedPassword = checkUserExistence[0].password;

            if (checkUserExistence) {
                // Compare the provided password with the stored hashed password
                const passwordMatch = await bcrypt.compare(password, storedPassword);
                if (passwordMatch) {
                    console.log("checkUserExistence[0].id: ", checkUserExistence[0].id);
                    console.log("checkUserExistence[0].email: ", checkUserExistence[0].email);
                    console.log("checkUserExistence[0].role: ", checkUserExistence[0].role);

                    const token = jwt.sign(
                        {
                            id: checkUserExistence[0].id,
                            email: checkUserExistence[0].email,
                            role: checkUserExistence[0].role,
                        },
                        JWT_SECRET,
                        { expiresIn: '24h' }
                    );

                    console.log("Token: ", token);

                    const response: ApiResponse = { status: 200, message: 'Login successfully', data: token };
                    return NextResponse.json(response);
                } else {
                    const response: ApiResponse = { status: 400, message: 'Password Not Match.' };
                    return NextResponse.json(response);
                }
            } else {
                const response: ApiResponse = { status: 400, message: 'This Account Does Not Exist.' };
                return NextResponse.json(response);
            }
        } else {
            const response: ApiResponse = { status: 400, message: 'Please Fill all fields.' };
            return NextResponse.json(response);
        }
    } catch (error) {
        console.error("Error occurred:", error); // Log the error
        return NextResponse.json({ message: "Failed", status: 500 });
    }
}