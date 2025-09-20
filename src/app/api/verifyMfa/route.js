import { NextResponse } from "next/server";
import { verifyJWT, generateJWT, verifyMFACode } from "../../lib/auth-utils.js";
import { getUserSession, storeUserSession, incrementMFAAttempts, checkMFALockout, resetMFAAttempts } from "../../lib/storage.js";

export async function POST(request) {
	try {
		const { username, code, token } = await request.json();

		// Validate input
		if (!username || !code || !token) {
			return NextResponse.json({ error: "Username, MFA code, and token are required" }, { status: 400 });
		}

		const cleanUsername = username.trim().toLowerCase();

		// Verify the JWT token
		const decoded = verifyJWT(token);
		if (!decoded || decoded.username !== cleanUsername || decoded.step !== "mfa_required") {
			return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
		}

		// Check for MFA lockout
		const lockoutStatus = checkMFALockout(cleanUsername);
		if (lockoutStatus.isLocked) {
			const remainingMinutes = Math.ceil(lockoutStatus.remainingTime / (60 * 1000));
			return NextResponse.json(
				{
					error: `Account locked due to too many failed MFA attempts. Please try again in ${remainingMinutes} minute(s).`,
					lockedUntil: lockoutStatus.remainingTime,
					attempts: lockoutStatus.attempts,
				},
				{ status: 423 } // 423 Locked
			);
		}

		// Get user session
		const session = getUserSession(cleanUsername);
		if (!session || !session.mfaSecret) {
			return NextResponse.json({ error: "Invalid session. Please login again." }, { status: 401 });
		}

		// Verify MFA code
		const isValidCode = verifyMFACode(code, session.mfaSecret);

		if (!isValidCode) {
			// Increment failed attempts
			const attempts = incrementMFAAttempts(cleanUsername);
			const remainingAttempts = 3 - attempts;

			if (remainingAttempts <= 0) {
				return NextResponse.json(
					{
						error: "Invalid MFA code. Account has been locked due to too many failed attempts.",
						attempts: attempts,
						locked: true,
					},
					{ status: 423 }
				);
			}

			return NextResponse.json(
				{
					error: `Invalid MFA code. ${remainingAttempts} attempt(s) remaining.`,
					attempts: attempts,
					remainingAttempts: remainingAttempts,
				},
				{ status: 401 }
			);
		}

		// MFA successful - reset attempts and update session
		resetMFAAttempts(cleanUsername);

		// Update session to fully authenticated
		const updatedSession = {
			...session,
			step: "authenticated",
			mfaVerifiedAt: Date.now(),
			fullyAuthenticated: true,
		};

		storeUserSession(cleanUsername, updatedSession);

		// Generate final JWT token for authenticated session
		const finalToken = generateJWT(
			{
				username: cleanUsername,
				name: session.name,
				step: "authenticated",
				sessionId: decoded.sessionId,
				authenticated: true,
			},
			"1h"
		); // Longer-lived token for authenticated session

		return NextResponse.json({
			success: true,
			message: "MFA verification successful. Login complete.",
			token: finalToken,
			user: {
				username: cleanUsername,
				name: session.name,
			},
			step: "authenticated",
		});
	} catch (error) {
		console.error("Error in verifyMfa API:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// Only allow POST method
export async function GET() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
