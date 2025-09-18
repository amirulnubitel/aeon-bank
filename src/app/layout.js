import Navbar from "@/components/navbar";
import "./globals.css";

export const metadata = {
	title: "Aeon Bank",
	description: "Aeon Bank",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<meta name="apple-mobile-web-app-title" content="Aeon Bank" />
			</head>
			<body className="antialiased">
				<Navbar />
				{children}
			</body>
		</html>
	);
}
