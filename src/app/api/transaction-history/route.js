import { NextResponse } from "next/server";

// Mock transaction data
const transactions = [
	{
		id: 1,
		date: new Date().toLocaleDateString(),
		reference_id: "#123456788",
		to: "Bloom Enterprice",
		transaction_type: "DuitNow Payment",
		amount: "RM 10.00",
	},
	{
		id: 2,
		date: new Date(Date.now() - 86400000).toLocaleDateString(), // Yesterday
		reference_id: "#123456789",
		to: "Tech Solutions Sdn Bhd",
		transaction_type: "Online Transfer",
		amount: "RM 250.50",
	},
	{
		id: 3,
		date: new Date(Date.now() - 172800000).toLocaleDateString(), // 2 days ago
		reference_id: "#123456790",
		to: "Monthly Utilities",
		transaction_type: "Bill Payment",
		amount: "RM 85.75",
	},
	{
		id: 4,
		date: new Date(Date.now() - 259200000).toLocaleDateString(), // 3 days ago
		reference_id: "#123456791",
		to: "Grocery Store",
		transaction_type: "Debit Card",
		amount: "RM 45.20",
	},
	{
		id: 5,
		date: new Date(Date.now() - 345600000).toLocaleDateString(), // 4 days ago
		reference_id: "#123456792",
		to: "Coffee Bean Cafe",
		transaction_type: "DuitNow Payment",
		amount: "RM 12.80",
	},
];

export async function GET() {
	try {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		return NextResponse.json({
			success: true,
			data: transactions,
			total: transactions.length,
		});
	} catch (error) {
		return NextResponse.json({ success: false, error: "Failed to fetch transaction history" }, { status: 500 });
	}
}
