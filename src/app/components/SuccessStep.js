"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessStep({ user, token }) {
	const [countdown, setCountdown] = useState(3);
	const router = useRouter();

	useEffect(() => {
		// Store token in localStorage for session management
		if (token) {
			localStorage.setItem("authToken", token);
			localStorage.setItem("user", JSON.stringify(user));
		}

		// Countdown timer before redirect
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					// Redirect to dashboard
					router.push("/dashboard");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [token, user, router]);

	const handleGoToDashboard = () => {
		router.push("/dashboard");
	};

	return (
		<div className="space-y-6 max-w-md mx-auto">
			<div className="text-center">
				<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
					<svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
				<p className="text-gray-600">Welcome back, {user?.name || user?.username}!</p>
			</div>

			<div className="bg-green-50 rounded-lg p-6 text-center">
				<div className="text-sm text-green-800 mb-4">
					<strong>Authentication Complete</strong>
				</div>
				<div className="space-y-2 text-sm text-green-700">
					<div>✅ Username verified</div>
					<div>✅ Secure word validated</div>
					<div>✅ Password authenticated</div>
					<div>✅ Multi-factor authentication completed</div>
					<div>✅ Session established</div>
				</div>
			</div>

			<div className="bg-blue-50 rounded-lg p-4">
				<div className="text-sm text-blue-800">
					<strong>Session Information:</strong>
					<div className="mt-2 space-y-1 font-mono text-xs">
						<div>User: {user?.username}</div>
						<div>Name: {user?.name}</div>
						<div>Login Time: {new Date().toLocaleString()}</div>
						<div>Session: Active</div>
					</div>
				</div>
			</div>

			<div className="text-center">
				<div className="text-sm text-gray-600 mb-4">
					Redirecting to dashboard in {countdown} second{countdown !== 1 ? "s" : ""}...
				</div>

				<button onClick={handleGoToDashboard} className="w-full bg-[#ef24b8] hover:bg-[#d91ea3] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200  focus:ring-2 focus:ring-[#ef24b8] focus:ring-offset-2">
					Go to Dashboard Now
				</button>
			</div>

			<div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
				<strong>Security Summary:</strong>
				<ul className="mt-2 space-y-1 list-disc list-inside">
					<li>Multi-step authentication completed</li>
					<li>Secure session token generated</li>
					<li>Client-side password hashing used</li>
					<li>Time-based secure word validation</li>
					<li>TOTP-based multi-factor authentication</li>
				</ul>
			</div>
		</div>
	);
}
