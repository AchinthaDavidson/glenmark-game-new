import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { SLMC_ID, Score, Completed } = req.body;

    if (!SLMC_ID) {
      return res.status(400).json({ message: "SLMC_ID is required" });
    }

    // Update doctor's score and completion status
    const { error: updateError } = await supabase
      .from("Doctors")
      .update({
        Score: Score,
        Completed: Completed,
      })
      .eq("SLMC_ID", SLMC_ID);

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({ message: "Score updated successfully" });
  } catch (error) {
    console.error("Update score error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
