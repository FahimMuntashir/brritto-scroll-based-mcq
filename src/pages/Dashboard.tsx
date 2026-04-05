import { Link } from "react-router-dom";
import {
  Bell,
  BookOpen,
  BookText,
  ChevronRight,
  ClipboardList,
  FileArchive,
  HelpCircle,
  Home,
  Inbox,
  Menu,
  ScanLine,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const shortcuts = [
  {
    title: "My Course",
    subtitle: "Knowledge hub",
    icon: BookText,
    iconClass: "text-amber-500",
  },
  {
    title: "Learn",
    subtitle: "Study vault",
    icon: BookOpen,
    iconClass: "text-emerald-500",
    href: "/learn",
  },
  {
    title: "Test",
    subtitle: "Mock sets",
    icon: ClipboardList,
    iconClass: "text-cyan-500",
  },
  {
    title: "Archived Exam",
    subtitle: "Exam vault",
    icon: FileArchive,
    iconClass: "text-indigo-500",
  },
  {
    title: "Doubt",
    subtitle: "My doubts",
    icon: HelpCircle,
    iconClass: "text-orange-500",
  },
  {
    title: "Study Circle",
    subtitle: "Peer support",
    icon: Users,
    iconClass: "text-fuchsia-500",
  },
];

const DashboardPage = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(244,245,248,1)_48%,_rgba(238,240,244,1)_100%)] pb-24">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pt-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200/70">
              <span className="text-2xl font-bold">F</span>
            </div>
            <div>
              <p className="text-[15px] font-semibold uppercase tracking-[0.28em] text-slate-400">Student</p>
              <h1 className="text-[1.85rem] font-extrabold leading-none tracking-tight text-slate-900">
                Fahim Muntashir
              </h1>
              <p className="mt-1 text-lg font-semibold text-slate-500">SSC 26</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <button className="rounded-full border border-white/80 bg-white/80 p-3 shadow-sm shadow-slate-200/70 transition hover:text-slate-900">
              <Search className="h-5 w-5" />
            </button>
            <button className="rounded-full border border-white/80 bg-white/80 p-3 shadow-sm shadow-slate-200/70 transition hover:text-slate-900">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        <Card className="mt-7 overflow-hidden rounded-[28px] border-white/70 bg-white/75 p-4 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="flex items-center justify-between gap-4 rounded-[22px] bg-gradient-to-r from-rose-50 via-white to-rose-100 p-4">
            <div>
              <div className="flex items-center gap-2 text-rose-500">
                <Bell className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Live Event</span>
              </div>
              <p className="mt-2 text-lg font-extrabold leading-tight text-rose-600">Join Live Exam Now...!</p>
            </div>
            <div className="rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-200">
              1 Exam
            </div>
          </div>
        </Card>

        <section className="mt-6 grid grid-cols-3 gap-3">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            const content = (
              <Card
                className={cn(
                  "flex min-h-[146px] flex-col justify-between rounded-[26px] border-white/80 bg-white/90 p-4 text-left shadow-[0_22px_50px_-34px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-0.5",
                  item.href && "ring-1 ring-transparent hover:ring-orange-200",
                )}
              >
                <div className={cn("w-fit rounded-2xl bg-slate-50 p-3", item.iconClass)}>
                  <Icon className="h-7 w-7" strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold leading-tight text-slate-800">{item.title}</h2>
                  <p className="mt-1 text-base font-semibold text-slate-500">{item.subtitle}</p>
                </div>
              </Card>
            );

            return item.href ? (
              <Link key={item.title} to={item.href} aria-label={item.title}>
                {content}
              </Link>
            ) : (
              <button key={item.title} type="button" className="text-left" aria-label={item.title}>
                {content}
              </button>
            );
          })}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[2rem] font-extrabold tracking-tight text-slate-900">Continue Learning</h2>
            <Link
              to="/learn"
              className="flex items-center gap-1 text-sm font-bold text-orange-500 transition hover:text-orange-600"
            >
              Learn
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <Card className="rounded-[30px] border-white/80 bg-white/95 p-5 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.45)]">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-500">
              0 days remaining
            </span>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Subject</p>
            <h3 className="mt-2 text-[1.7rem] font-extrabold text-slate-900">হিসাববিজ্ঞান</h3>
            <p className="mt-2 text-base font-semibold text-slate-500">হিসাববিজ্ঞান অধ্যায়ভিত্তিক প্রস্তুতি</p>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-orange-300 text-slate-700 shadow-inner">
                <BookText className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-400">Current path</p>
                <p className="text-base font-bold text-slate-700">Scroll-based revision track</p>
              </div>
              <Button asChild className="rounded-full px-4">
                <Link to="/learn">Open</Link>
              </Button>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-400">
                <span>Progress</span>
                <span className="text-orange-500">0%</span>
              </div>
              <Progress value={0} className="h-3 rounded-full bg-slate-100" />
            </div>
          </Card>
        </section>

        <section className="mt-6">
          <Card className="overflow-hidden rounded-[30px] border-0 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-orange-400 p-5 text-white shadow-[0_30px_60px_-26px_rgba(168,85,247,0.6)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">Booster</p>
                <h3 className="mt-2 text-3xl font-extrabold leading-tight">HSC'26 MCQ Booster</h3>
                <p className="mt-2 max-w-[14rem] text-sm font-medium text-white/85">
                  Practice smarter with chapter progress, timed revision, and fast-access study modes.
                </p>
              </div>
              <div className="rounded-[24px] bg-white/15 px-3 py-2 text-right backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">March 2026</p>
                <p className="mt-1 text-2xl font-extrabold">67%</p>
              </div>
            </div>
          </Card>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-md items-center justify-around rounded-t-[28px] border border-white/80 bg-white/95 px-3 py-3 shadow-[0_-20px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur">
        <DashboardNavItem icon={Home} label="Home" active />
        <DashboardNavItem icon={ScanLine} label="Scan" />
        <DashboardNavItem icon={Trophy} label="Rank List" />
        <DashboardNavItem icon={Inbox} label="Inbox" />
      </nav>
    </main>
  );
};

function DashboardNavItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: typeof Home;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-w-[72px] flex-col items-center gap-1 rounded-2xl px-2 py-1 text-xs font-bold transition",
        active ? "text-violet-600" : "text-slate-400",
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}

export default DashboardPage;
