import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) {
      return res.status(500).json({ message: "Supabase not configured" });
    }

    // Fetch top 10 doctors ordered by score (descending)
    const { data: leaderboard, error } = await supabase
      .from("Doctors")
      .select("DoctorName, SLMC_ID, Score, Completed")
      .order("Score", { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return res.status(200).json(leaderboard || []);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    // Return empty array instead of error to prevent UI crash
    return res.status(200).json([]);
  }
}
