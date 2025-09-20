import { NextResponse } from "next/server";
import { removeUserSession } from "../../lib/storage.js";

export async function POST(request) {
	try {
		const { username } = await request.json();

		if (username) {
			// Remove server-side session
			removeUserSession(username.toLowerCase().trim());
		}

		return NextResponse.json({
			success: true,
			message: "Logged out successfully",
		});
	} catch (error) {
		console.error("Error in logout API:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function GET() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
