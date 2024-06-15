import { query } from "@/app/config/db";
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

type QueryResult = Service[] | OkPacket | any | any[];

// Define types for database query results
interface OkPacket {
    affectedRows: number;
}

// Define a type for the expected request payload
interface UserAccountRequest {
    name: string;
    email: string;
    password: string;
}

interface Service {
    id: number;
    name: string;
}

// Define a type for the response data
interface ApiResponse {
    status: number;
    message: string;
    data?: any; // Data is optional and can be of any type
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { name, email, password }: UserAccountRequest = await request.json();
        console.log("hit api register backend");
        if (name && email && password) {
            // Check if the user already exists in the database
            const checkUserExistence = await query({
                query: 'SELECT COUNT(*) as count FROM user_accounts WHERE email = ?',
                values: [email],
            });

            // Type-check and ensure the expected structure
            if (Array.isArray(checkUserExistence) && 'count' in checkUserExistence[0]) {
                if (checkUserExistence[0].count > 0) { // Optional chaining to prevent undefined errors
                    const response: ApiResponse = { status: 400, message: 'This Account Already Exist' };
                    return NextResponse.json(response);
                } else {
                    // Hash the password before saving it
                    const saltRounds = 10; // You can adjust the number of salt rounds
                    const hashedPassword = await bcrypt.hash(password, saltRounds);
                    // Insert a new user
                    const newUser = await query({
                        query: 'INSERT INTO user_accounts (name, email, password) VALUES (?, ?,?)',
                        values: [name, email, hashedPassword],
                    });
                    // Ensure newUser has the expected structure
                    if ('affectedRows' in newUser && newUser.affectedRows > 0) {
                        const response: ApiResponse = { status: 200, message: 'Your Account has been created', data: newUser };
                        return NextResponse.json(response);
                    } else {
                        const response: ApiResponse = { status: 400, message: 'Your request cannot submit. Try Again Later!', data: newService };
                        return NextResponse.json(response);
                    }
                }
            } else {
                const response: ApiResponse = { status: 400, message: 'Your request cannot submit to Admin. Try Again Later!' };
                return NextResponse.json(response);
            }
        } else {
            // If required fields are missing
            const response: ApiResponse = { status: 400, message: 'Fill All the Fields' };
            return NextResponse.json(response);
        }
    } catch (error) {
        console.error("Error occurred:", error); // Log the error
        return NextResponse.json({ message: "Failed", status: 500 });
    }
}