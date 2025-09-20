"use client";

import { useState } from "react";
import UsernameStep from "./UsernameStep";
import SecureWordStep from "./SecureWordStep";
import PasswordStep from "./PasswordStep";
import MFAStep from "./MFAStep";
import SuccessStep from "./SuccessStep";

export default function Login() {
	const [currentStep, setCurrentStep] = useState("username");
	const [loginData, setLoginData] = useState({});

	const handleSecureWordReceived = (data) => {
		setLoginData({
			...loginData,
			username: data.username,
			secureWord: data.secureWord,
			expiresIn: data.expiresIn,
		});
		setCurrentStep("secureWord");
	};

	const handleSecureWordNext = () => {
		setCurrentStep("password");
	};

	const handleLoginSuccess = (data) => {
		setLoginData({
			...loginData,
			token: data.token,
			requiresMFA: data.requiresMFA,
			mfaSecret: data.mfaSecret,
			otpauth_url: data.otpauth_url,
			step: data.step,
		});

		if (data.requiresMFA) {
			setCurrentStep("mfa");
		} else {
			setCurrentStep("success");
		}
	};

	const handleMFASuccess = (data) => {
		setLoginData({
			...loginData,
			finalToken: data.token,
			user: data.user,
			step: data.step,
		});
		setCurrentStep("success");
	};

	const renderProgressBar = () => {
		const steps = [
			{ key: "username", label: "Username", number: 1 },
			{ key: "secureWord", label: "Secure Word", number: 2 },
			{ key: "password", label: "Password", number: 3 },
			{ key: "mfa", label: "MFA", number: 4 },
			{ key: "success", label: "Complete", number: 5 },
		];

		const getCurrentStepNumber = () => {
			const stepMap = { username: 1, secureWord: 2, password: 3, mfa: 4, success: 5 };
			return stepMap[currentStep] || 1;
		};

		const currentStepNumber = getCurrentStepNumber();

		return (
			<div className="mb-8 hidden lg:block">
				<div className="flex items-center justify-between">
					{steps.map((step, index) => (
						<div key={step.key} className="flex items-center">
							<div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step.number <= currentStepNumber ? "bg-[#ef24b8] text-white" : "bg-gray-200 text-gray-600"}`}>
								{step.number <= currentStepNumber && step.number < currentStepNumber ? (
									<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
								) : (
									step.number
								)}
							</div>
							<span className={`ml-2 text-sm ${step.number <= currentStepNumber ? "text-gray-900" : "text-gray-500"}`}>{step.label}</span>
							{index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${step.number < currentStepNumber ? "bg-[#ef24b8]" : "bg-gray-200"}`} />}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="w-full max-w-2xl mx-auto">
			{renderProgressBar()}

			{currentStep === "username" && <UsernameStep onSecureWordReceived={handleSecureWordReceived} />}

			{currentStep === "secureWord" && <SecureWordStep username={loginData.username} secureWord={loginData.secureWord} expiresIn={loginData.expiresIn} onNext={handleSecureWordNext} />}

			{currentStep === "password" && <PasswordStep username={loginData.username} secureWord={loginData.secureWord} onLoginSuccess={handleLoginSuccess} />}

			{currentStep === "mfa" && <MFAStep username={loginData.username} token={loginData.token} otpauth_url={loginData.otpauth_url} mfaSecret={loginData.mfaSecret} onMFASuccess={handleMFASuccess} />}

			{currentStep === "success" && <SuccessStep user={loginData.user} token={loginData.finalToken} />}
		</div>
	);
}
