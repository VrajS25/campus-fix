"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function NewComplaintPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Plumbing");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Demo student account
  const studentId = "e9e7be7f-48e1-4484-9cf8-e4f4a0189352";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (!title.trim()) {
      setError("Please enter a complaint title.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter the location.");
      return;
    }

    if (!description.trim()) {
      setError("Please describe the problem.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create complaint
      const { data: complaint, error: complaintError } =
        await supabase
          .from("complaints")
          .insert({
            user_id: studentId,
            title: title.trim(),
            category,
            location: location.trim(),
            description: description.trim(),
            priority,
            status: "Pending",
          })
          .select()
          .single();

      if (complaintError) {
        console.error("Complaint insert error:", complaintError);
        setError(
          complaintError.message || "Could not submit complaint."
        );
        setLoading(false);
        return;
      }

      // 2. Add first timeline update
      const { error: updateError } = await supabase
        .from("complaint_updates")
        .insert({
          complaint_id: complaint.id,
          title: "Complaint submitted",
          description:
            "Your complaint has been successfully submitted and is waiting for review.",
        });

      if (updateError) {
        console.error("Timeline update error:", updateError);

        // Complaint itself was created, so don't treat the whole
        // submission as failed.
        setSuccess(
          "Complaint submitted successfully, but the timeline update could not be created."
        );

        setTimeout(() => {
          router.push("/complaints");
        }, 1200);

        return;
      }

      // 3. Success
      setSuccess("Complaint submitted successfully!");

      setTimeout(() => {
        router.push("/complaints");
      }, 800);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Back */}
        <Link
          href="/complaints"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to My Complaints
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Raise a Complaint
          </h1>

          <p className="text-slate-400 mt-2">
            Report an issue on campus and track its resolution.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Complaint Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Complaint Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wi-Fi not working in Block B"
              className="w-full bg-[#111827] border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#111827] border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
            >
              <option value="Plumbing">Plumbing</option>
              <option value="Electricity">Electricity</option>
              <option value="Internet / Wi-Fi">
                Internet / Wi-Fi
              </option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Hostel">Hostel</option>
              <option value="Classroom">Classroom</option>
              <option value="Furniture">Furniture</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Location
            </label>

            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Hostel Block A"
                className="w-full bg-[#111827] border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition"
              />

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                📍
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={5}
              className="w-full bg-[#111827] border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Priority
            </label>

            <div className="grid grid-cols-3 gap-3">

              {/* Low */}
              <button
                type="button"
                onClick={() => setPriority("Low")}
                className={`rounded-xl py-3 border transition ${
                  priority === "Low"
                    ? "border-green-500 bg-green-500/10 text-green-400"
                    : "border-slate-800 bg-[#111827] text-slate-400 hover:border-slate-700"
                }`}
              >
                Low
              </button>

              {/* Medium */}
              <button
                type="button"
                onClick={() => setPriority("Medium")}
                className={`rounded-xl py-3 border transition ${
                  priority === "Medium"
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                    : "border-slate-800 bg-[#111827] text-slate-400 hover:border-slate-700"
                }`}
              >
                Medium
              </button>

              {/* High */}
              <button
                type="button"
                onClick={() => setPriority("High")}
                className={`rounded-xl py-3 border transition ${
                  priority === "High"
                    ? "border-red-500 bg-red-500/10 text-red-400"
                    : "border-slate-800 bg-[#111827] text-slate-400 hover:border-slate-700"
                }`}
              >
                High
              </button>

            </div>
          </div>

          {/* Image Upload - UI only */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Attach Image{" "}
              <span className="text-slate-600">(Optional)</span>
            </label>

            <div className="border border-dashed border-slate-700 rounded-xl bg-[#0d1528] p-10 text-center hover:border-slate-600 transition">

              <div className="w-10 h-10 mx-auto rounded-lg bg-slate-800 flex items-center justify-center mb-3">
                <Upload
                  size={20}
                  className="text-slate-400"
                />
              </div>

              <p className="text-sm text-slate-300">
                Click to upload an image
              </p>

              <p className="text-xs text-slate-600 mt-1">
                PNG, JPG up to 5MB
              </p>

            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3">
              <AlertCircle size={18} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3">
              <CheckCircle2 size={18} />
              <p className="text-sm">{success}</p>
            </div>
          )}

          {/* Info */}
          <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-4">
            <AlertCircle
              size={18}
              className="text-blue-400 mt-0.5 shrink-0"
            />

            <p className="text-sm text-slate-400">
              Your complaint will be reviewed by the campus
              administration. You can track its status from your
              dashboard.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 transition"
          >
            {loading ? "Submitting Complaint..." : "Submit Complaint"}
          </button>

        </form>
      </div>
    </div>
  );
}