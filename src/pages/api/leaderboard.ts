import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("Fetching leaderboard...");
  try {
    const response = await fetch(
      "http://127.0.0.1:8080/leaderboard",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }
    console.log("Leaderboard fetched successfully");
    const data = await response.json();
    console.log("Sending leaderboard data:", data);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
}
