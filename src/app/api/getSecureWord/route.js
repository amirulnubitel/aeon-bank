import { NextResponse } from "next/server";
import { generateSecureWord } from "../../lib/auth-utils.js";
import { storeSecureWord, checkRateLimit, getRateLimitRemaining } from "../../lib/storage.js";

export async function POST(request) {
	try {
		const { username } = await request.json();

		// Validate input
		if (!username || typeof username !== "string" || username.trim() === "") {
			return NextResponse.json({ error: "Username is required" }, { status: 400 });
		}

		const cleanUsername = username.trim().toLowerCase();

		// Check rate limiting
		if (!checkRateLimit(cleanUsername)) {
			const remainingTime = getRateLimitRemaining(cleanUsername);
			return NextResponse.json(
				{
					error: "Rate limit exceeded. Please wait before requesting another secure word.",
					remainingTime: Math.ceil(remainingTime / 1000), // Convert to seconds
				},
				{ status: 429 }
			);
		}

		// Generate secure word
		const secureWord = generateSecureWord(cleanUsername);

		// Store secure word with expiration
		storeSecureWord(cleanUsername, secureWord);

		return NextResponse.json({
			success: true,
			secureWord: secureWord,
			expiresIn: 60, // 60 seconds
		});
	} catch (error) {
		console.error("Error in getSecureWord API:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// Only allow POST method
export async function GET() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
