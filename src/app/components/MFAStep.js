"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { generateMFACode } from "../lib/auth-utils.js";

export default function MFAStep({ username, token, otpauth_url, mfaSecret, onMFASuccess }) {
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [currentTOTP, setCurrentTOTP] = useState("");
	const [timeRemaining, setTimeRemaining] = useState(30);
	const [attempts, setAttempts] = useState(0);
	const [locked, setLocked] = useState(false);
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

	// Generate current TOTP code for demo purposes
	useEffect(() => {
		// Generate QR code for TOTP setup
		const generateQRCode = async () => {
			try {
				if (mfaSecret) {
					// Create TOTP URL for authenticator apps
					const otpAuthUrl = `otpauth://totp/AeonBank:${username}?secret=${mfaSecret}&issuer=AeonBank`;

					// Generate QR code as data URL
					const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl, {
						width: 200,
						margin: 2,
						color: {
							dark: "#000000",
							light: "#FFFFFF",
						},
					});

					setQrCodeDataUrl(qrCodeUrl);
				}
			} catch (error) {
				console.error("Error generating QR code:", error);
			}
		};

		generateQRCode();

		const updateTOTP = () => {
			try {
				const newCode = generateMFACode(mfaSecret);
				setCurrentTOTP(newCode);

				// Calculate time remaining in current 30-second window
				const now = Math.floor(Date.now() / 1000);
				const remaining = 30 - (now % 30);
				setTimeRemaining(remaining);
			} catch (error) {
				console.error("Error generating TOTP:", error);
			}
		};

		updateTOTP();
		const interval = setInterval(updateTOTP, 1000);

		return () => clearInterval(interval);
	}, [mfaSecret]);

	const handleInputChange = (e) => {
		const value = e.target.value.replace(/\D/g, "").slice(0, 6);
		setCode(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!code || code.length !== 6) {
			setError("Please enter a 6-digit MFA code");
			return;
		}

		if (locked) {
			setError("Account is locked. Please wait before trying again.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await fetch("/api/verifyMfa", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: username,
					code: code,
					token: token,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				// Success
				onMFASuccess({
					token: data.token,
					user: data.user,
					step: data.step,
				});
			} else {
				setError(data.error || "MFA verification failed");

				if (data.attempts) {
					setAttempts(data.attempts);
				}

				if (data.locked || response.status === 423) {
					setLocked(true);
				}

				// Clear the input on failed attempt
				setCode("");
			}
		} catch (err) {
			console.error("Network error:", err);
			setError("Network error. Please check your connection.");
		} finally {
			setLoading(false);
		}
	};

	const formatTime = (seconds) => {
		return seconds.toString().padStart(2, "0");
	};

	return (
		<div className="space-y-6 max-w-md mx-auto">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Multi-Factor Authentication</h2>
				<p className="text-gray-600">Scan the QR code with your authenticator app or enter the 6-digit code.</p>
			</div>

			{/* QR Code Section */}
			<div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
				<h3 className="text-lg font-medium text-gray-900 mb-4">Setup Authenticator App</h3>
				{qrCodeDataUrl ? (
					<div className="space-y-4">
						<img src={qrCodeDataUrl} alt="TOTP QR Code" className="mx-auto border border-gray-300 rounded-lg" />
						<div className="text-sm text-gray-600">
							<p className="font-medium">Scan this QR code with your authenticator app</p>
							<p className="mt-1">or manually enter the secret key:</p>
							<code className="mt-2 block bg-gray-100 p-2 rounded text-xs font-mono break-all">{mfaSecret}</code>
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center h-48">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ef24b8]"></div>
						<span className="ml-2 text-gray-600">Generating QR Code...</span>
					</div>
				)}
			</div>

			<div className="bg-blue-50 rounded-lg p-4">
				<div className="text-sm text-blue-800">
					<strong>User:</strong> <span className="font-mono">{username}</span>
				</div>
			</div>

			{/* Demo TOTP Display */}
			<div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
				<div className="text-center">
					<div className="text-sm text-green-700 mb-2">
						<strong>Demo Mode - Current TOTP Code:</strong>
					</div>
					<div className="text-3xl font-mono font-bold text-green-600 tracking-wider mb-2">{currentTOTP}</div>
					<div className="text-sm text-green-600">Refreshes in: {formatTime(timeRemaining)}s</div>
					<div className="text-xs text-green-600 mt-2">Use this code for testing, or scan the QR code above with Google Authenticator</div>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label htmlFor="mfa-code" className="block text-base font-medium text-gray-900">
						6-Digit MFA Code
					</label>
					<div className="mt-2">
						<input
							id="mfa-code"
							name="mfa-code"
							type="text"
							inputMode="numeric"
							pattern="[0-9]*"
							maxLength={6}
							required
							value={code}
							onChange={handleInputChange}
							disabled={loading || locked}
							className="block w-full rounded-md bg-white px-3 py-2 text-center text-2xl font-mono text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2  disabled:bg-gray-100 disabled:cursor-not-allowed tracking-widest"
							placeholder="000000"
						/>
					</div>
					<div className="mt-1 text-sm text-gray-500 text-center">Enter the 6-digit code from your authenticator app or use the demo code above</div>
				</div>

				{error && (
					<div className="rounded-md bg-red-50 p-4">
						<div className="text-sm text-red-700">
							{error}
							{attempts > 0 && attempts < 3 && <div className="mt-1">Attempts used: {attempts}/3</div>}
						</div>
					</div>
				)}

				{locked && (
					<div className="rounded-md bg-red-50 p-4">
						<div className="text-sm text-red-700">
							<strong>Account Locked</strong>
							<div className="mt-1">Your account has been temporarily locked due to too many failed MFA attempts. Please wait 15 minutes before trying again.</div>
						</div>
					</div>
				)}

				<div>
					<button
						type="submit"
						disabled={loading || locked || code.length !== 6}
						className="flex w-full justify-center rounded-md bg-[#ef24b8] px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#d91ea3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef24b8] disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						{loading ? (
							<span className="flex items-center">
								<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Verifying...
							</span>
						) : locked ? (
							"Account Locked"
						) : (
							"Verify Code"
						)}
					</button>
				</div>
			</form>

			<div className="text-sm text-gray-500 bg-amber-50 p-4 rounded-md">
				<strong>Security Features:</strong>
				<ul className="mt-2 space-y-1 list-disc list-inside">
					<li>Maximum 3 verification attempts</li>
					<li>15-minute lockout after failed attempts</li>
					<li>Time-based one-time passwords (TOTP)</li>
					<li>30-second refresh interval</li>
				</ul>
			</div>

			<div className="text-center">
				<button onClick={() => window.location.reload()} className="text-sm text-gray-500 hover:text-gray-700 underline">
					Start over
				</button>
			</div>
		</div>
	);
}
