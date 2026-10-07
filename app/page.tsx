"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type ComplaintData = {
  id: string;
  title: string;
  category: string;
  created_at: string;
  priority: string;
  status: string;
};

const STUDENT_ID = "e9e7be7f-48e1-4484-9cf8-e4f4a0189352";

export default function Home() {
  const [complaints, setComplaints] = useState<ComplaintData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    const { data, error } = await supabase
      .from("complaints")
      .select("id, title, category, created_at, priority, status")
      .eq("user_id", STUDENT_ID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Dashboard complaints error:", error);
      setLoading(false);
      return;
    }

    setComplaints(data || []);
    setLoading(false);
  }

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

  const filteredComplaints = complaints.filter((complaint) =>
    `${complaint.title} ${complaint.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-950 p-5 lg:block">

        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
            CF
          </div>

          <div>
            <h1 className="font-semibold">CampusFix</h1>
            <p className="text-xs text-slate-500">
              Campus Support
            </p>
          </div>
        </div>

        <nav className="space-y-2">

          <NavItem
            href="/"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active
          />

          <NavItem
            href="/complaints"
            icon={<ClipboardList size={18} />}
            label="My Complaints"
          />

          <NavItem
            href="/complaints/new"
            icon={<PlusCircle size={18} />}
            label="Raise Complaint"
          />

          <NavItem
            href="/admin"
            icon={<Settings size={18} />}
            label="Admin Dashboard"
          />

        </nav>

        <div className="absolute bottom-5 left-5 right-5 space-y-2">

          <button
            onClick={() =>
              alert("Settings will be available in the next version.")
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

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenu(false)}
          />

          <aside className="relative h-full w-72 bg-slate-950 border-r border-slate-800 p-5">

            <div className="flex items-center justify-between mb-10">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
                  CF
                </div>

                <div>
                  <h1 className="font-semibold">
                    CampusFix
                  </h1>

                  <p className="text-xs text-slate-500">
                    Campus Support
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

              <NavItem
                href="/"
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                active
              />

              <NavItem
                href="/complaints"
                icon={<ClipboardList size={18} />}
                label="My Complaints"
              />

              <NavItem
                href="/complaints/new"
                icon={<PlusCircle size={18} />}
                label="Raise Complaint"
              />

              <NavItem
                href="/admin"
                icon={<Settings size={18} />}
                label="Admin Dashboard"
              />

            </nav>

          </aside>
        </div>
      )}

      {/* Main */}
      <main className="lg:ml-64">

        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-800 px-6 lg:px-10">

          <div>
            <h2 className="text-xl font-semibold">
              Dashboard
            </h2>

            <p className="text-sm text-slate-500">
              Manage your campus complaints
            </p>
          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                alert("You have no new notifications.")
              }
              className="rounded-xl border border-slate-800 p-2.5 hover:bg-slate-900 transition"
              title="Notifications"
            >
              <Bell size={19} />
            </button>

            <div className="hidden items-center gap-3 sm:flex">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">
                VS
              </div>

              <div>
                <p className="text-sm font-medium">
                  Vraj Savaliya
                </p>

                <p className="text-xs text-slate-500">
                  Student
                </p>
              </div>

            </div>

          </div>
        </header>

        <div className="p-6 lg:p-10">

          {/* Welcome */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="text-sm text-slate-500">
                Good evening 👋
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Welcome back, Vraj
              </h1>
            </div>

            <Link
              href="/complaints/new"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium transition hover:bg-blue-500"
            >
              <PlusCircle size={18} />
              Raise Complaint
            </Link>

          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Complaints"
              value={loading ? "..." : String(total)}
              description="All complaints"
              icon={<ClipboardList size={20} />}
            />

            <StatCard
              title="Pending"
              value={loading ? "..." : String(pending)}
              description="Waiting for action"
              icon={<Clock3 size={20} />}
            />

            <StatCard
              title="In Progress"
              value={loading ? "..." : String(inProgress)}
              description="Currently being handled"
              icon={<AlertCircle size={20} />}
            />

            <StatCard
              title="Resolved"
              value={loading ? "..." : String(resolved)}
              description="Successfully resolved"
              icon={<CheckCircle2 size={20} />}
            />

          </div>

          {/* Recent complaints */}
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40">

            <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-6 sm:flex-row sm:items-center">

              <div>
                <h2 className="font-semibold">
                  Recent Complaints
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track the latest complaints you've submitted
                </p>
              </div>

              <div className="flex items-center gap-3">

                <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">

                  <Search
                    size={17}
                    className="text-slate-500"
                  />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search..."
                    className="w-32 bg-transparent text-sm outline-none placeholder:text-slate-600"
                  />

                </div>

                <Link
                  href="/complaints"
                  className="hidden sm:flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                >
                  View All
                  <ArrowUpRight size={15} />
                </Link>

              </div>

            </div>

            <div className="divide-y divide-slate-800">

              {loading ? (
                <div className="p-8 text-center text-slate-500">
                  Loading complaints...
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="p-10 text-center">

                  <ClipboardList
                    size={35}
                    className="mx-auto text-slate-700 mb-3"
                  />

                  <p className="text-slate-400">
                    {search
                      ? "No complaints match your search."
                      : "You haven't submitted any complaints yet."}
                  </p>

                  {!search && (
                    <Link
                      href="/complaints/new"
                      className="inline-flex items-center gap-2 mt-4 text-sm text-blue-400 hover:text-blue-300"
                    >
                      <PlusCircle size={16} />
                      Raise your first complaint
                    </Link>
                  )}

                </div>
              ) : (
                filteredComplaints
                  .slice(0, 5)
                  .map((complaint) => (
                    <Complaint
                      key={complaint.id}
                      id={complaint.id}
                      title={complaint.title}
                      category={complaint.category}
                      date={new Date(
                        complaint.created_at
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      priority={complaint.priority}
                      status={complaint.status}
                    />
                  ))
              )}

            </div>

            {/* Mobile View All */}
            <div className="border-t border-slate-800 p-4 sm:hidden">

              <Link
                href="/complaints"
                className="flex items-center justify-center gap-2 text-sm text-blue-400"
              >
                View All Complaints
                <ArrowUpRight size={15} />
              </Link>

            </div>

          </div>
        </div>
      </main>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenu(true)}
        className="fixed bottom-5 right-5 rounded-full bg-blue-600 p-4 shadow-lg hover:bg-blue-500 transition lg:hidden"
      >
        <Menu size={22} />
      </button>

    </div>
  );
}

/* ---------------- NAV ITEM ---------------- */

function NavItem({
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

/* ---------------- STAT CARD ---------------- */

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">

      <div className="mb-5 flex items-center justify-between">

        <p className="text-sm text-slate-400">
          {title}
        </p>

        <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
          {icon}
        </div>

      </div>

      <p className="text-3xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}

/* ---------------- COMPLAINT ---------------- */

function Complaint({
  id,
  title,
  category,
  date,
  priority,
  status,
}: {
  id: string;
  title: string;
  category: string;
  date: string;
  priority: string;
  status: string;
}) {
  return (
    <Link
      href={`/complaints/${id}`}
      className="flex flex-col gap-4 p-6 transition hover:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
    >

      <div className="flex items-start gap-4">

        <div className="mt-1 rounded-xl bg-slate-800 p-3">
          <ClipboardList
            size={18}
            className="text-slate-400"
          />
        </div>

        <div>

          <h3 className="font-medium">
            {title}
          </h3>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
            <span>{category}</span>
            <span>•</span>
            <span>{date}</span>
          </div>

        </div>

      </div>

      <div className="flex items-center gap-3">

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            priority === "High"
              ? "bg-red-500/10 text-red-400"
              : priority === "Medium"
              ? "bg-yellow-500/10 text-yellow-400"
              : "bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {priority}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            status === "Resolved"
              ? "bg-emerald-500/10 text-emerald-400"
              : status === "In Progress"
              ? "bg-blue-500/10 text-blue-400"
              : "bg-yellow-500/10 text-yellow-400"
          }`}
        >
          {status}
        </span>

        <ArrowUpRight
          size={18}
          className="text-slate-600"
        />

      </div>

    </Link>
  );
}