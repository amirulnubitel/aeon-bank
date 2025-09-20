import crypto from "crypto";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";

// Secret keys - in production, these should be environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const SECURE_WORD_SECRET = process.env.SECURE_WORD_SECRET || "secure-word-secret-key";

/**
 * Generate a secure word using HMAC based on username and timestamp
 * @param {string} username - The username to generate secure word for
 * @returns {string} - A secure word (first 8 characters of HMAC)
 */
export function generateSecureWord(username) {
	const timestamp = Date.now();
	const data = `${username}-${timestamp}`;
	const hmac = crypto.createHmac("sha256", SECURE_WORD_SECRET);
	hmac.update(data);
	const hash = hmac.digest("hex");
	// Return first 8 characters as the secure word
	return hash.substring(0, 8).toUpperCase();
}

/**
 * Hash a password using SHA-256
 * @param {string} password - The password to hash
 * @returns {string} - The hashed password
 */
export function hashPassword(password) {
	const hash = crypto.createHash("sha256");
	hash.update(password);
	return hash.digest("hex");
}

/**
 * Generate a JWT token
 * @param {object} payload - The payload to include in the token
 * @param {string} expiresIn - Token expiration time (default: 1h)
 * @returns {string} - The JWT token
 */
export function generateJWT(payload, expiresIn = "1h") {
	return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify a JWT token
 * @param {string} token - The token to verify
 * @returns {object|null} - The decoded payload or null if invalid
 */
export function verifyJWT(token) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		return null;
	}
}

/**
 * Generate a secret key for TOTP
 * @returns {string} - Base32 encoded secret
 */
export function generateMFASecret() {
	return speakeasy.generateSecret({
		name: "Aeon Bank",
		length: 32,
	});
}

/**
 * Generate a TOTP code for MFA
 * @param {string} secret - The base32 encoded secret
 * @returns {string} - 6-digit TOTP code
 */
export function generateMFACode(secret) {
	return speakeasy.totp({
		secret: secret,
		encoding: "base32",
		time: Math.floor(Date.now() / 1000),
		step: 30,
		digits: 6,
	});
}

/**
 * Verify a TOTP code
 * @param {string} code - The code to verify
 * @param {string} secret - The base32 encoded secret
 * @param {number} window - Time window for verification (default: 1)
 * @returns {boolean} - Whether the code is valid
 */
export function verifyMFACode(code, secret, window = 1) {
	return speakeasy.totp.verify({
		secret: secret,
		encoding: "base32",
		token: code,
		time: Math.floor(Date.now() / 1000),
		step: 30,
		window: window,
	});
}

/**
 * Check if a timestamp is expired
 * @param {number} timestamp - The timestamp to check
 * @param {number} expirationMs - Expiration time in milliseconds
 * @returns {boolean} - Whether the timestamp is expired
 */
export function isExpired(timestamp, expirationMs) {
	return Date.now() - timestamp > expirationMs;
}
