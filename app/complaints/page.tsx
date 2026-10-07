"use client";

import {
  ArrowLeft,
  Search,
  Filter,
  ClipboardList,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Complaint = {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  priority: string;
  status: string;
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
  try {
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("COMPLAINT DATA:", data);
    console.log("COMPLAINT ERROR:", error);

    if (error) {
      console.error("Supabase error:", error);
      return;
    }

    const formatted = (data || []).map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      location: item.location,
      priority: item.priority,
      status: item.status,
      date: new Date(item.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    setComplaints(formatted);
  } catch (error) {
    console.error("Unexpected error:", error);
  } finally {
    setLoading(false);
  }
}

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesFilter =
      filter === "All" || complaint.status === filter;

    const matchesSearch =
      complaint.title.toLowerCase().includes(search.toLowerCase()) ||
      complaint.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const activeCount = complaints.filter(
    (c) => c.status !== "Resolved"
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center">
            <Link
              href="/"
              className="mr-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="font-semibold">My Complaints</h1>
              <p className="text-sm text-slate-500">
                Track all your submitted complaints
              </p>
            </div>
          </div>

          <Link
            href="/complaints/new"
            className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500 sm:flex"
          >
            <Plus size={17} />
            Raise Complaint
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Total" value={complaints.length} />
          <SummaryCard label="Active" value={activeCount} />
          <SummaryCard label="Resolved" value={resolvedCount} />
        </div>

        {/* Toolbar */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5">
            <Search size={17} className="text-slate-500" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaints..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600 sm:w-64"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-300 outline-none"
            >
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
        </div>

        {/* Complaints */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="hidden grid-cols-[1fr_150px_120px_130px] gap-4 border-b border-slate-800 px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-600 md:grid">
            <span>Complaint</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading complaints...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-16 text-center">
              <ClipboardList
                size={35}
                className="mx-auto mb-4 text-slate-700"
              />

              <p className="text-sm text-slate-500">
                No complaints found.
              </p>

              <Link
                href="/complaints/new"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium"
              >
                <Plus size={16} />
                Raise Complaint
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filteredComplaints.map((complaint) => (
                <Link
                  href={`/complaints/${complaint.id}`}
                  key={complaint.id}
                  className="block transition hover:bg-slate-900"
                >
                  <div className="grid gap-4 px-6 py-5 md:grid-cols-[1fr_150px_120px_130px] md:items-center">
                    <div className="flex items-start gap-4">
                      <div className="hidden rounded-xl bg-slate-800 p-3 sm:block">
                        <ClipboardList
                          size={18}
                          className="text-slate-400"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium">
                            {complaint.title}
                          </h3>

                          <ArrowUpRight
                            size={14}
                            className="text-slate-600"
                          />
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {complaint.category}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {complaint.location}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${complaint.priority === "High"
                            ? "bg-red-500/10 text-red-400"
                            : complaint.priority === "Medium"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                      >
                        {complaint.priority}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${complaint.status === "Resolved"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : complaint.status === "In Progress"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-yellow-500/10 text-yellow-400"
                          }`}
                      >
                        {complaint.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">
                      {complaint.date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}