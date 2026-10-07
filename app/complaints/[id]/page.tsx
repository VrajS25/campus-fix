"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type Update = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
};

function ComplaintDetailsContent() {
  const params = useParams();

  const id = params.id as string;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchComplaint() {
      const { data: complaintData, error: complaintError } =
        await supabase
          .from("complaints")
          .select("*")
          .eq("id", id)
          .single();

      if (complaintError) {
        console.error("Complaint fetch error:", complaintError);
        setLoading(false);
        return;
      }

      const { data: updateData, error: updateError } =
        await supabase
          .from("complaint_updates")
          .select("*")
          .eq("complaint_id", id)
          .order("created_at", { ascending: true });

      if (updateError) {
        console.error("Updates fetch error:", updateError);
      }

      setComplaint(complaintData);
      setUpdates(updateData || []);
      setLoading(false);
    }

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <p className="text-slate-400">Loading complaint...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />

        <h1 className="text-xl font-bold text-white">
          Complaint not found
        </h1>

        <Link
          href="/complaints"
          className="mt-4 text-blue-400 hover:text-blue-300"
        >
          Back to complaints
        </Link>
      </div>
    );
  }

  const statusColor =
    complaint.status === "Resolved"
      ? "bg-green-500/10 text-green-400 border border-green-500/20"
      : complaint.status === "In Progress"
      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
      : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";

  return (
    <div className="min-h-screen bg-[#0b1120] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Back */}
        <Link
          href="/complaints"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to My Complaints
        </Link>

        {/* Header */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

            <div>
              <p className="text-xs text-slate-500 mb-2">
                Complaint ID
              </p>

              <p className="text-sm text-blue-400 mb-3 break-all">
                {complaint.id}
              </p>

              <h1 className="text-2xl font-bold text-white">
                {complaint.title}
              </h1>

              <div className="flex flex-wrap gap-3 mt-4 text-sm text-slate-400">

                <span className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  {complaint.location}
                </span>

                <span>•</span>

                <span>{complaint.category}</span>

                <span>•</span>

                <span>
                  {new Date(
                    complaint.created_at
                  ).toLocaleDateString()}
                </span>

              </div>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${statusColor}`}
            >
              {complaint.status}
            </span>

          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Left */}
          <div className="md:col-span-2 space-y-6">

            {/* Description */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">

              <h2 className="font-semibold text-white mb-4">
                Complaint Description
              </h2>

              <p className="text-slate-400 leading-7">
                {complaint.description}
              </p>

            </div>

            {/* Timeline */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">

              <div className="flex items-center justify-between mb-6">

                <h2 className="font-semibold text-white">
                  Complaint Timeline
                </h2>

                <span className="text-xs text-slate-500">
                  {updates.length} update
                  {updates.length !== 1 ? "s" : ""}
                </span>

              </div>

              {updates.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  No updates yet.
                </p>
              ) : (
                <div className="space-y-6">

                  {updates.map((update, index) => (
                    <div
                      key={update.id}
                      className="flex gap-4"
                    >

                      {/* Icon */}
                      <div className="flex flex-col items-center">

                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === updates.length - 1 &&
                            complaint.status === "Resolved"
                              ? "bg-green-500/10"
                              : "bg-blue-500/10"
                          }`}
                        >

                          {index === updates.length - 1 &&
                          complaint.status === "Resolved" ? (
                            <CheckCircle2
                              size={19}
                              className="text-green-400"
                            />
                          ) : (
                            <Clock
                              size={19}
                              className="text-blue-400"
                            />
                          )}

                        </div>

                        {index !== updates.length - 1 && (
                          <div className="w-px flex-1 bg-slate-800 mt-2" />
                        )}

                      </div>

                      {/* Content */}
                      <div className="pb-4">

                        <h3 className="font-medium text-white">
                          {update.title}
                        </h3>

                        {update.description && (
                          <p className="text-sm text-slate-400 mt-1">
                            {update.description}
                          </p>
                        )}

                        <p className="text-xs text-slate-600 mt-2">
                          {new Date(
                            update.created_at
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>
          </div>

          {/* Right info */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">

            <h2 className="font-semibold text-white mb-6">
              Complaint Information
            </h2>

            <div className="space-y-6 text-sm">

              <div>
                <p className="text-slate-500">
                  Category
                </p>

                <p className="font-medium text-slate-200 mt-1">
                  {complaint.category}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Location
                </p>

                <p className="font-medium text-slate-200 mt-1">
                  {complaint.location}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Priority
                </p>

                <p
                  className={`font-medium mt-1 ${
                    complaint.priority === "High"
                      ? "text-red-400"
                      : complaint.priority === "Medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {complaint.priority}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Submitted
                </p>

                <p className="font-medium text-slate-200 mt-1">
                  {new Date(
                    complaint.created_at
                  ).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Last Updated
                </p>

                <p className="font-medium text-slate-200 mt-1">
                  {new Date(
                    complaint.updated_at
                  ).toLocaleDateString()}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ComplaintDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
          <p className="text-slate-400">
            Loading complaint...
          </p>
        </div>
      }
    >
      <ComplaintDetailsContent />
    </Suspense>
  );
}