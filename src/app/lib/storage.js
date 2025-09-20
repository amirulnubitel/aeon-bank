/**
 * In-memory storage for secure words, user sessions, and MFA attempts
 * In production, this should be replaced with Redis or a proper database
 */

// Storage maps
const secureWordStore = new Map();
const userSessionStore = new Map();
const mfaAttemptStore = new Map();
const rateLimitStore = new Map();

// Configuration constants
const SECURE_WORD_EXPIRY = 60 * 1000; // 60 seconds
const RATE_LIMIT_WINDOW = 10 * 1000; // 10 seconds
const MAX_MFA_ATTEMPTS = 3;

/**
 * Store a secure word for a user
 * @param {string} username - The username
 * @param {string} secureWord - The secure word
 */
export function storeSecureWord(username, secureWord) {
	secureWordStore.set(username, {
		secureWord,
		issuedAt: Date.now(),
	});
}

/**
 * Get and validate a secure word for a user
 * @param {string} username - The username
 * @returns {object|null} - Secure word data or null if not found/expired
 */
export function getSecureWord(username) {
	const data = secureWordStore.get(username);
	if (!data) return null;

	// Check if expired
	if (Date.now() - data.issuedAt > SECURE_WORD_EXPIRY) {
		secureWordStore.delete(username);
		return null;
	}

	return data;
}

/**
 * Remove a secure word after use
 * @param {string} username - The username
 */
export function removeSecureWord(username) {
	secureWordStore.delete(username);
}

/**
 * Check and enforce rate limiting for secure word requests
 * @param {string} username - The username
 * @returns {boolean} - Whether the request is allowed
 */
export function checkRateLimit(username) {
	const lastRequest = rateLimitStore.get(username);
	const now = Date.now();

	if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW) {
		return false;
	}

	rateLimitStore.set(username, now);
	return true;
}

/**
 * Get remaining time until next secure word request is allowed
 * @param {string} username - The username
 * @returns {number} - Remaining time in milliseconds
 */
export function getRateLimitRemaining(username) {
	const lastRequest = rateLimitStore.get(username);
	if (!lastRequest) return 0;

	const remaining = RATE_LIMIT_WINDOW - (Date.now() - lastRequest);
	return Math.max(0, remaining);
}

/**
 * Store user session data
 * @param {string} username - The username
 * @param {object} sessionData - The session data to store
 */
export function storeUserSession(username, sessionData) {
	userSessionStore.set(username, {
		...sessionData,
		createdAt: Date.now(),
	});
}

/**
 * Get user session data
 * @param {string} username - The username
 * @returns {object|null} - Session data or null if not found
 */
export function getUserSession(username) {
	return userSessionStore.get(username) || null;
}

/**
 * Remove user session
 * @param {string} username - The username
 */
export function removeUserSession(username) {
	userSessionStore.delete(username);
}

/**
 * Track MFA attempts for a user
 * @param {string} username - The username
 * @returns {number} - Current attempt count
 */
export function incrementMFAAttempts(username) {
	const current = mfaAttemptStore.get(username) || { attempts: 0, lockedUntil: 0 };
	current.attempts += 1;

	// Lock user if max attempts reached
	if (current.attempts >= MAX_MFA_ATTEMPTS) {
		current.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
	}

	mfaAttemptStore.set(username, current);
	return current.attempts;
}

/**
 * Check if user is locked out from MFA attempts
 * @param {string} username - The username
 * @returns {object} - Lock status and remaining time
 */
export function checkMFALockout(username) {
	const data = mfaAttemptStore.get(username);
	if (!data) return { isLocked: false, remainingTime: 0 };

	if (data.lockedUntil > Date.now()) {
		return {
			isLocked: true,
			remainingTime: data.lockedUntil - Date.now(),
			attempts: data.attempts,
		};
	}

	return { isLocked: false, remainingTime: 0, attempts: data.attempts };
}

/**
 * Reset MFA attempts for a user (on successful verification)
 * @param {string} username - The username
 */
export function resetMFAAttempts(username) {
	mfaAttemptStore.delete(username);
}

/**
 * Clean up expired data (should be called periodically)
 */
export function cleanupExpiredData() {
	const now = Date.now();

	// Clean up expired secure words
	for (const [username, data] of secureWordStore.entries()) {
		if (now - data.issuedAt > SECURE_WORD_EXPIRY) {
			secureWordStore.delete(username);
		}
	}

	// Clean up old rate limit entries
	for (const [username, timestamp] of rateLimitStore.entries()) {
		if (now - timestamp > RATE_LIMIT_WINDOW * 2) {
			rateLimitStore.delete(username);
		}
	}

	// Clean up expired MFA lockouts
	for (const [username, data] of mfaAttemptStore.entries()) {
		if (data.lockedUntil > 0 && data.lockedUntil < now) {
			mfaAttemptStore.delete(username);
		}
	}
}

// Start cleanup interval (every minute)
setInterval(cleanupExpiredData, 60000);

export default {
	storeSecureWord,
	getSecureWord,
	removeSecureWord,
	checkRateLimit,
	getRateLimitRemaining,
	storeUserSession,
	getUserSession,
	removeUserSession,
	incrementMFAAttempts,
	checkMFALockout,
	resetMFAAttempts,
	cleanupExpiredData,
};
