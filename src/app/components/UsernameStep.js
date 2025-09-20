"use client";

import { useState } from "react";

export default function UsernameStep({ onSecureWordReceived }) {
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [rateLimitRemaining, setRateLimitRemaining] = useState(0);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!username.trim()) {
			setError("Please enter a username");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await fetch("/api/getSecureWord", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: username.trim() }),
			});

			const data = await response.json();

			if (response.ok) {
				// Success - pass secure word to parent component
				onSecureWordReceived({
					username: username.trim(),
					secureWord: data.secureWord,
					expiresIn: data.expiresIn,
				});
			} else {
				// Handle errors
				if (response.status === 429) {
					setError(data.error);
					setRateLimitRemaining(data.remainingTime);

					// Start countdown timer
					const timer = setInterval(() => {
						setRateLimitRemaining((prev) => {
							if (prev <= 1) {
								clearInterval(timer);
								return 0;
							}
							return prev - 1;
						});
					}, 1000);
				} else {
					setError(data.error || "An error occurred");
				}
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
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h2>
				<p className="text-gray-600">Please enter your username to begin the secure login process.</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label htmlFor="username" className="block text-base font-medium text-gray-900">
						Username
					</label>
					<div className="mt-2">
						<input
							id="username"
							name="username"
							type="text"
							required
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							disabled={loading || rateLimitRemaining > 0}
							className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2  disabled:bg-gray-100 disabled:cursor-not-allowed"
							placeholder="Enter your username"
						/>
					</div>
				</div>

				{error && (
					<div className="rounded-md bg-red-50 p-4">
						<div className="text-sm text-red-700">
							{error}
							{rateLimitRemaining > 0 && (
								<div className="mt-1">
									Please wait {rateLimitRemaining} second{rateLimitRemaining !== 1 ? "s" : ""} before trying again.
								</div>
							)}
						</div>
					</div>
				)}

				<div>
					<button
						type="submit"
						disabled={loading || rateLimitRemaining > 0}
						className="flex w-full justify-center rounded-md bg-[#ef24b8] px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#d91ea3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef24b8] disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						{loading ? (
							<span className="flex items-center">
								<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Requesting Secure Word...
							</span>
						) : rateLimitRemaining > 0 ? (
							`Wait ${rateLimitRemaining}s`
						) : (
							"Get Secure Word"
						)}
					</button>
				</div>
			</form>

			<div className="text-sm text-gray-500 bg-blue-50 p-4 rounded-md">
				<strong>Demo Credentials:</strong>
				<ul className="mt-2 space-y-1">
					<li>
						• Username: <code className="bg-gray-100 px-2 py-1 rounded">demo</code> / Password: <code className="bg-gray-100 px-2 py-1 rounded">demo123</code>
					</li>
					<li>
						• Username: <code className="bg-gray-100 px-2 py-1 rounded">aoen</code> / Password: <code className="bg-gray-100 px-2 py-1 rounded">password456</code>
					</li>
				</ul>
			</div>
		</div>
	);
}
