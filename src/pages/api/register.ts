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
    const { DoctorName, SLMC_ID } = req.body;

    if (!DoctorName || !SLMC_ID) {
      return res.status(400).json({ message: "DoctorName and SLMC_ID are required" });
    }

    // Check if doctor already exists
    const { data: existingDoctor, error: fetchError } = await supabase
      .from("Doctors")
      .select("*")
      .eq("SLMC_ID", SLMC_ID)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows returned, which is expected for new doctors
      throw fetchError;
    }

    // If doctor already exists
    if (existingDoctor) {
      if (existingDoctor.Completed === true) {
        return res.status(400).json({ message: "Doctor is already registered" });
      } else {
        return res.status(200).json({ message: "Doctor already exists but game not completed" });
      }
    }

    // Register new doctor
    const { error: insertError } = await supabase.from("Doctors").insert({
      DoctorName: DoctorName,
      SLMC_ID: SLMC_ID,
      LoginTime: new Date().toISOString(),
      Score: 0,
      Completed: false,
    });

    if (insertError) {
      throw insertError;
    }

    return res.status(201).json({ message: "Doctor registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
