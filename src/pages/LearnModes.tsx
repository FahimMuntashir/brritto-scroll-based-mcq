import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BadgeCheck, LayoutPanelTop, Layers3, ListCollapse, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const modes = [
  {
    title: "Scroll Based Learn",
    description: "Continuous chapter feed with the same current project layout you already built.",
    stats: "Best for fast revision",
    href: "/learn/scroll",
    icon: ListCollapse,
    accent: "from-orange-500 to-amber-400",
    badge: "Current Flow",
    clickable: true,
  },
  {
    title: "Card Based Learn",
    description: "Card-by-card learning will come later, but for now this option stays visible as part of the roadmap.",
    // stats: "Coming soon",
    icon: LayoutPanelTop,
    accent: "from-sky-500 to-cyan-400",
    badge: "Locked",
    clickable: false,
  },
];

const LearnModesPage = () => {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fff8ef_0%,_#ffffff_32%,_#f7f8fb_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10 pt-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-orange-600">
            Learn Modes
          </span>
        </div>

        <section className="mt-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Choose how you want to learn</h1>
          <p className="mt-3 text-base font-medium leading-7 text-slate-500">
            Start with the mode that fits your study mood. You can switch anytime from the dashboard.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const content = (
              <Card
                className={`overflow-hidden rounded-[30px] border-white/80 bg-white/95 p-5 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.45)] transition duration-200 ${
                  mode.clickable ? "hover:-translate-y-1" : "opacity-80"
                }`}
              >
                <div className={`rounded-[24px] bg-gradient-to-br ${mode.accent} p-5 text-white`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur">
                      {mode.badge}
                    </span>
                  </div>

                  <h2 className="mt-6 text-2xl font-extrabold">{mode.title}</h2>
                  <p className="mt-2 max-w-[16rem] text-sm font-medium leading-6 text-white/85">{mode.description}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    {mode.clickable ? (
                      <BadgeCheck className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-slate-400" />
                    )}
                    <span>{mode.stats}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                    {/* <span>{mode.clickable ? "Open mode" : "Not active yet"}</span> */}
                    {mode.clickable ? <ArrowRight className="h-4 w-4" /> : null}
                  </div>
                </div>
              </Card>
            );

            return mode.clickable ? (
              <Link key={mode.title} to={mode.href!}>
                {content}
              </Link>
            ) : (
              <div key={mode.title} aria-disabled="true">
                {content}
              </div>
            );
          })}
        </section>

        <section className="mt-6">
          {/* <Card className="rounded-[28px] border-dashed border-orange-200 bg-orange-50/70 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white p-3 text-orange-500 shadow-sm">
                <Layers3 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Workflow summary</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                  Dashboard to Learn to Mode Select to Study Screen. The scroll-based option now opens your existing
                  page exactly as requested.
                </p>
              </div>
            </div>
          </Card> */}
        </section>
      </div>
    </main>
  );
};

export default LearnModesPage;
