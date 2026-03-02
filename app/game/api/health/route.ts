import { NextResponse } from "next/server";

export function GET() {
	return new NextResponse(
		JSON.stringify({ status: "ok", message: "API is healthy" }),
		{
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
}
