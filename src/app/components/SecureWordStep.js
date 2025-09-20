"use client";

import { useState, useEffect } from "react";

export default function SecureWordStep({ username, secureWord, expiresIn, onNext }) {
	const [timeRemaining, setTimeRemaining] = useState(expiresIn);
	const [expired, setExpired] = useState(false);

	useEffect(() => {
		if (timeRemaining <= 0) {
			setExpired(true);
			return;
		}

		const timer = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					setExpired(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [timeRemaining]);

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const getTimeColor = () => {
		if (timeRemaining <= 10) return "text-red-600";
		if (timeRemaining <= 30) return "text-orange-600";
		return "text-green-600";
	};

	if (expired) {
		return (
			<div className="space-y-6 max-w-md mx-auto">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Word Expired</h2>
					<p className="text-gray-600">Your secure word has expired. Please start the login process again.</p>
				</div>

				<div className="rounded-md bg-red-50 p-4">
					<div className="text-sm text-red-700">The secure word has expired for security reasons. Please go back and request a new secure word.</div>
				</div>

				<div>
					<button
						onClick={() => window.location.reload()}
						className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
					>
						Start Over
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-md mx-auto">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Your Secure Word</h2>
				<p className="text-gray-600">Please memorize this secure word. You'll need it for the next step.</p>
			</div>

			<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center border border-blue-200">
				<div className="text-sm text-gray-600 mb-2">
					Secure Word for <strong>{username}</strong>
				</div>
				<div className="text-4xl font-mono font-bold text-indigo-600 tracking-widest mb-4 select-all">{secureWord}</div>
				<div className={`text-lg font-semibold ${getTimeColor()}`}>Expires in: {formatTime(timeRemaining)}</div>
			</div>

			<div className="rounded-md bg-amber-50 p-4">
				<div className="text-sm text-amber-700">
					<strong>Important:</strong>
					<ul className="mt-2 space-y-1 list-disc list-inside">
						<li>This secure word will expire in {expiresIn} seconds</li>
						<li>You'll need to enter this word along with your password</li>
						<li>The secure word is case-sensitive</li>
					</ul>
				</div>
			</div>

			<div>
				<button onClick={onNext} className="flex w-full justify-center rounded-md bg-[#ef24b8] px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#d91ea3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef24b8]">
					Continue to Password
				</button>
			</div>

			<div className="text-center">
				<button onClick={() => window.location.reload()} className="text-sm text-gray-500 hover:text-gray-700 underline">
					Start over with a different username
				</button>
			</div>
		</div>
	);
}
