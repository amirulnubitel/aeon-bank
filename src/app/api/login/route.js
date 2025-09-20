import { NextResponse } from "next/server";
import { generateJWT, generateMFASecret } from "../../lib/auth-utils.js";
import { getSecureWord, removeSecureWord, storeUserSession } from "../../lib/storage.js";

// Mock user database - in production, this would be a real database
const MOCK_USERS = {
	aoen: {
		username: "aoen",
		hashedPassword: "c6ba91b90d922e159893f46c387e5dc1b3dc5c101a5a4522f03b987177a24a91", // SHA-256 of "password456"
		name: "Aoen Bank",
	},
	demo: {
		username: "demo",
		hashedPassword: "d3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791", // SHA-256 of "demo123"
		name: "Demo User",
	},
};

export async function POST(request) {
	try {
		const { username, hashedPassword, secureWord } = await request.json();

		// Validate input
		if (!username || !hashedPassword || !secureWord) {
			return NextResponse.json({ error: "Username, hashed password, and secure word are required" }, { status: 400 });
		}

		const cleanUsername = username.trim().toLowerCase();

		// Check if user exists
		const user = MOCK_USERS[cleanUsername];
		if (!user) {
			return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
		}

		// Verify password
		if (user.hashedPassword !== hashedPassword) {
			return NextResponse.json({ error: "Invalid password" }, { status: 401 });
		}

		// Validate secure word
		const storedSecureWordData = getSecureWord(cleanUsername);
		if (!storedSecureWordData) {
			return NextResponse.json({ error: "Secure word has expired or is invalid. Please request a new one." }, { status: 401 });
		}

		if (storedSecureWordData.secureWord !== secureWord.toUpperCase()) {
			return NextResponse.json({ error: "Invalid secure word" }, { status: 401 });
		}

		// Remove used secure word
		removeSecureWord(cleanUsername);

		// Generate MFA secret for this session
		const mfaSecret = generateMFASecret();

		// Create user session
		const sessionData = {
			username: cleanUsername,
			name: user.name,
			mfaSecret: mfaSecret.base32,
			otpauth_url: mfaSecret.otpauth_url,
			loginTime: Date.now(),
			step: "mfa_required", // Next step is MFA
		};

		storeUserSession(cleanUsername, sessionData);

		// Generate JWT token for this intermediate step
		const token = generateJWT(
			{
				username: cleanUsername,
				step: "mfa_required",
				sessionId: Date.now(),
			},
			"15m"
		); // Short-lived token for MFA step

		return NextResponse.json({
			success: true,
			message: "Login successful. Please complete MFA verification.",
			token: token,
			requiresMFA: true,
			// mfaSecret: mfaSecret, // In production, this would be pre-configured per user
			mfaSecret: mfaSecret.base32,
			otpauth_url: mfaSecret.otpauth_url,
			step: "mfa_required",
		});
	} catch (error) {
		console.error("Error in login API:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// Only allow POST method
export async function GET() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
