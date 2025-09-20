"use client";

import { useState } from "react";
import CryptoJS from "crypto-js";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function PasswordStep({ username, secureWord, onLoginSuccess }) {
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const hashPassword = (password) => {
		return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!password) {
			setError("Please enter your password");
			return;
		}

		if (!secureWord) {
			setError("Secure word is missing. Please start the login process again.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			// Hash password on client side
			const hashedPassword = hashPassword(password);

			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: username,
					hashedPassword: hashedPassword,
					secureWord: secureWord,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				// Success - pass login data to parent component
				onLoginSuccess({
					token: data.token,
					requiresMFA: data.requiresMFA,
					mfaSecret: data.mfaSecret,
					otpauth_url: data.otpauth_url,
					step: data.step,
					username: username,
				});
			} else {
				setError(data.error || "Login failed");
			}
		} catch (err) {
			console.error("Network error:", err);
			setError("Network error. Please check your connection.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6 max-w-md mx-auto">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Password</h2>
				<p className="text-gray-600">Please enter your password to continue.</p>
			</div>

			<div className="bg-blue-50 rounded-lg p-4">
				<div className="text-sm text-blue-800">
					<strong>Login Details:</strong>
					<div className="mt-2 space-y-1">
						<div>
							Username: <span className="font-mono font-semibold">{username}</span>
						</div>
						<div>
							Secure Word: <span className="font-mono font-semibold">{secureWord}</span>
						</div>
					</div>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label htmlFor="password" className="block text-base font-medium text-gray-900">
						Password
					</label>
					<div className="mt-2 relative">
						<input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
							className="block w-full rounded-md bg-white px-3 py-2 pr-12 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2  disabled:bg-gray-100 disabled:cursor-not-allowed"
							placeholder="Enter your password"
						/>
						<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
							{showPassword ? <EyeIcon aria-hidden="true" className="size-5" /> : <EyeSlashIcon aria-hidden="true" className="size-5" />}
						</button>
					</div>
				</div>

				{error && (
					<div className="rounded-md bg-red-50 p-4">
						<div className="text-sm text-red-700">{error}</div>
					</div>
				)}

				<div>
					<button
						type="submit"
						disabled={loading}
						className="flex w-full justify-center rounded-md bg-[#ef24b8] px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#d91ea3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef24b8] disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						{loading ? (
							<span className="flex items-center">
								<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Authenticating...
							</span>
						) : (
							"Login"
						)}
					</button>
				</div>
			</form>

			<div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
				<strong>Security Note:</strong> Your password is hashed on your device using SHA-256 before being sent to the server.
			</div>

			<div className="text-center">
				<button onClick={() => window.location.reload()} className="text-sm text-gray-500 hover:text-gray-700 underline">
					Start over
				</button>
			</div>
		</div>
	);
}
