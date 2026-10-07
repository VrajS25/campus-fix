"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  AlertCircle,
  TrendingUp,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Complaint = {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  location: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    setLoading(true);

    const { data, error } = await supabase
      .from("complaints")
      .select(
        "id, title, category, priority, status, location, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin complaints error:", error);
    } else {
      setComplaints(data || []);
    }

    setLoading(false);
  }

  async function updateStatus(
    complaintId: string,
    newStatus: string
  ) {
    setUpdatingId(complaintId);

    const { error } = await supabase
      .from("complaints")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", complaintId);

    if (error) {
      console.error("Update error:", error);
      alert("Could not update complaint.");
    } else {
      setComplaints((current) =>
        current.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, status: newStatus }
            : complaint
        )
      );

      const { error: updateError } = await supabase
        .from("complaint_updates")
        .insert({
          complaint_id: complaintId,
          title: `Status changed to ${newStatus}`,
          description:
            "The complaint status was updated by campus administration.",
        });

      if (updateError) {
        console.error(
          "Timeline update error:",
          updateError
        );
      }
    }

    setUpdatingId(null);
  }

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesFilter =
        filter === "All" || complaint.status === filter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        complaint.title.toLowerCase().includes(searchText) ||
        complaint.category.toLowerCase().includes(searchText) ||
        complaint.location.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [complaints, search, filter]);

  const total = complaints.length;

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const resolutionRate =
    total === 0 ? 0 : Math.round((resolved / total) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-950 p-5 lg:block">

        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
            CF
          </div>

          <div>
            <h1 className="font-semibold">
              CampusFix
            </h1>

            <p className="text-xs text-slate-500">
              Administration
            </p>
          </div>
        </div>

        <nav className="space-y-2">

          <AdminNav
            href="/admin"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active
          />

          <AdminNav
            href="/complaints"
            icon={<ClipboardList size={18} />}
            label="Complaints"
          />

          <AdminNav
            href="/"
            icon={<Users size={18} />}
            label="Students"
          />

        </nav>

        <div className="absolute bottom-5 left-5 right-5 space-y-2">

          <button
            onClick={() =>
              alert(
                "Settings will be available in the next version."
              )
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            onClick={() =>
              alert("Logout is disabled in demo mode.")
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenu(false)}
          />

          <aside className="relative h-full w-72 border-r border-slate-800 bg-slate-950 p-5">

            <div className="mb-10 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
                  CF
                </div>

                <div>
                  <h1 className="font-semibold">
                    CampusFix
                  </h1>

                  <p className="text-xs text-slate-500">
                    Administration
                  </p>
                </div>

              </div>

              <button
                onClick={() => setMobileMenu(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            <nav className="space-y-2">

              <AdminNav
                href="/admin"
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                active
              />

              <AdminNav
                href="/complaints"
                icon={<ClipboardList size={18} />}
                label="Complaints"
              />

              <AdminNav
                href="/"
                icon={<Users size={18} />}
                label="Students"
              />

            </nav>

          </aside>
        </div>
      )}

      {/* Main */}
      <main className="lg:ml-64">

        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-800 px-6 lg:px-10">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setMobileMenu(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div>
              <h2 className="text-xl font-semibold">
                Admin Dashboard
              </h2>

              <p className="text-sm text-slate-500">
                Campus complaint management
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                Campus Admin
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">
              CA
            </div>

          </div>

        </header>

        <div className="p-6 lg:p-10">

          {/* Heading */}
          <div className="mb-8">
            <p className="text-sm text-slate-500">
              Overview
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Campus Support Center
            </h1>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <AdminStat
              title="Total Complaints"
              value={total}
              icon={<ClipboardList size={20} />}
            />

            <AdminStat
              title="Pending"
              value={pending}
              icon={<Clock3 size={20} />}
            />

            <AdminStat
              title="In Progress"
              value={inProgress}
              icon={<AlertCircle size={20} />}
            />

            <AdminStat
              title="Resolved"
              value={resolved}
              icon={<CheckCircle2 size={20} />}
            />

          </div>

          {/* Main Content */}
          <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">

            {/* Complaints */}
            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">

              <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-6 sm:flex-row sm:items-center">

                <div>
                  <h2 className="font-semibold">
                    Recent Complaints
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage campus complaints
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">

                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">

                    <Search
                      size={16}
                      className="text-slate-500"
                    />

                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search"
                      className="w-32 bg-transparent text-sm outline-none placeholder:text-slate-600"
                    />

                  </div>

                  <div className="flex items-center gap-2">

                    <Filter
                      size={16}
                      className="text-slate-500"
                    />

                    <select
                      value={filter}
                      onChange={(e) =>
                        setFilter(e.target.value)
                      }
                      className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none"
                    >
                      <option>All</option>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>

                  </div>

                </div>

              </div>

              {loading ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  Loading complaints...
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  No complaints found.
                </div>
              ) : (
                <div className="divide-y divide-slate-800">

                  {filteredComplaints.map((complaint) => (
                    <ComplaintRow
                      key={complaint.id}
                      complaint={complaint}
                      updatingId={updatingId}
                      onUpdateStatus={updateStatus}
                    />
                  ))}

                </div>
              )}

            </section>

            {/* Analytics */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

              <div className="mb-6">
                <h2 className="font-semibold">
                  Complaint Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Distribution by category
                </p>
              </div>

              <div className="space-y-5">

                <CategoryProgress
                  label="Electrical"
                  count={
                    complaints.filter(
                      (c) => c.category === "Electrical"
                    ).length
                  }
                  total={total}
                />

                <CategoryProgress
                  label="Internet / Wi-Fi"
                  count={
                    complaints.filter(
                      (c) => c.category === "Internet / Wi-Fi"
                    ).length
                  }
                  total={total}
                />

                <CategoryProgress
                  label="Plumbing"
                  count={
                    complaints.filter(
                      (c) => c.category === "Plumbing"
                    ).length
                  }
                  total={total}
                />

                <CategoryProgress
                  label="Classroom"
                  count={
                    complaints.filter(
                      (c) => c.category === "Classroom"
                    ).length
                  }
                  total={total}
                />

              </div>

              <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

                <div className="flex items-center gap-2">

                  <TrendingUp
                    size={17}
                    className="text-blue-400"
                  />

                  <p className="text-sm font-medium text-blue-300">
                    Resolution rate
                  </p>

                </div>

                <p className="mt-2 text-3xl font-bold">
                  {resolutionRate}%
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Based on current complaints
                </p>

              </div>

            </section>

          </div>
        </div>
      </main>

    </div>
  );
}

/* ---------------- COMPLAINT ROW ---------------- */

function ComplaintRow({
  complaint,
  updatingId,
  onUpdateStatus,
}: {
  complaint: Complaint;
  updatingId: string | null;
  onUpdateStatus: (
    complaintId: string,
    newStatus: string
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-5 transition hover:bg-slate-900">

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <Link
          href={`/complaints/${complaint.id}`}
          className="group"
        >
          <p className="text-sm font-medium group-hover:text-blue-400 transition">
            {complaint.title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {complaint.category} • {complaint.location}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {new Date(
              complaint.created_at
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </Link>

        <div className="flex flex-wrap items-center gap-3">

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              complaint.priority === "High"
                ? "bg-red-500/10 text-red-400"
                : complaint.priority === "Medium"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {complaint.priority}
          </span>

          <select
            value={complaint.status}
            disabled={updatingId === complaint.id}
            onChange={(e) =>
              onUpdateStatus(
                complaint.id,
                e.target.value
              )
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500 disabled:opacity-50"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <Link
            href={`/complaints/${complaint.id}`}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-blue-400 transition"
            title="View complaint"
          >
            <ArrowUpRight size={18} />
          </Link>

        </div>

      </div>

    </div>
  );
}

/* ---------------- ADMIN NAV ---------------- */

function AdminNav({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
        active
          ? "bg-blue-600/10 text-blue-400"
          : "text-slate-400 hover:bg-slate-900 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

/* ---------------- ADMIN STAT ---------------- */

function AdminStat({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-400">
          {title}
        </p>

        <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
          {icon}
        </div>

      </div>

      <p className="mt-5 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}

/* ---------------- CATEGORY ---------------- */

function CategoryProgress({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const percentage =
    total === 0
      ? 0
      : Math.round((count / total) * 100);

  return (
    <div>

      <div className="mb-2 flex justify-between text-xs">

        <span className="text-slate-400">
          {label}
        </span>

        <span className="text-slate-600">
          {count}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${percentage}%` }}
        />

      </div>

    </div>
  );
}