import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Check,
  PlayCircle,
  Star,
  Users,
  Zap,
  LayoutGrid,
  Boxes,
  Github,
  Slack,
  Figma,
  Link2,
  Shield,
  Globe,
  Mail,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const staggerRefs = useRef([]);
  const addToStagger = (el) => {
    if (el && !staggerRefs.current.includes(el)) {
      staggerRefs.current.push(el);
    }
  };

  const logos = useMemo(
    () => ["Acme", "Globex", "Umbrella", "Initech", "Hooli", "Stark"],
    []
  );

  const features = useMemo(
    () => [
      {
        icon: <Zap className="h-5 w-5" />,
        title: "Real-time Collaboration",
        desc: "Work together on boards with live updates, typing presence, and conflict safety.",
      },
      {
        icon: <LayoutGrid className="h-5 w-5" />,
        title: "Visual Kanban",
        desc: "Organize work with draggable cards, swimlanes, priorities, and smart statuses.",
      },
      {
        icon: <Users className="h-5 w-5" />,
        title: "Smart Assignment",
        desc: "Auto-assign tasks based on load, history, and skills—override anytime.",
      },
      {
        icon: <Shield className="h-5 w-5" />,
        title: "Enterprise-grade Security",
        desc: "SSO/SAML, role-based access, audit logs, and region-based data residency.",
      },
    ],
    []
  );

  const useCases = useMemo(
    () => [
      {
        badge: "Startups",
        title: "Ship faster with focus",
        points: [
          "Lightweight planning for weekly sprints",
          "Instant context via task activity",
          "Plug into GitHub for PR status",
        ],
      },
      {
        badge: "Agencies",
        title: "Deliver across clients",
        points: [
          "Client-scoped workspaces & permissions",
          "Templates for repeatable projects",
          "Beautiful status reports",
        ],
      },
      {
        badge: "Enterprises",
        title: "Scale with confidence",
        points: ["RBAC, SSO/SAML, audit logs", "SOC2-ready controls", "Guaranteed uptime SLAs"],
      },
      {
        badge: "Remote Teams",
        title: "Stay aligned async",
        points: [
          "Timezone-friendly automations",
          "Rich @mentions & watchers",
          "Board snapshots for updates",
        ],
      },
    ],
    []
  );

  const integrations = useMemo(
    () => [
      { icon: <Github className="h-5 w-5" />, name: "GitHub" },
      { icon: <Slack className="h-5 w-5" />, name: "Slack" },
      { icon: <Figma className="h-5 w-5" />, name: "Figma" },
      { icon: <Boxes className="h-5 w-5" />, name: "Jira" },
      { icon: <Globe className="h-5 w-5" />, name: "Notion" },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        quote:
          "Teamlens let us replace three tools, cut review cycles by 40%, and ship more often—without chaos.",
        name: "Marina K.",
        role: "PM @ Pixelcraft",
      },
      {
        quote:
          "The realtime board is insanely smooth. Smart assign just works, even across teams.",
        name: "Arun S.",
        role: "Head of Delivery @ Forward",
      },
      {
        quote:
          "Security reviews were painless. Audit logs + SSO sealed the deal for Enterprise.",
        name: "Dana R.",
        role: "CTO @ LatticeWorks",
      },
    ],
    []
  );

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(heroRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 });
      }

      staggerRefs.current.forEach((el) => {
        if (!el) return;
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          opacity: 0,
          y: 30,
          duration: 0.6,
        });
      });
    });

    return () => ctx.revert();
  }, []); 



  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-indigo-50">
      {/* Hero */}
      <header ref={heroRef} className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-10 top-24 h-72 w-72 rounded-full bg-indigo-100 blur-3xl opacity-60" />
          <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-blue-100 blur-3xl opacity-60" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 sm:pt-24 sm:pb-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                <Star className="h-3.5 w-3.5" /> New: Smart Assign for Teams
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Teamlens brings your <span className="text-indigo-600">tasks</span>,
                <br className="hidden sm:block" /> teammates, and tools together.
              </h1>

              <p className="max-w-xl text-base text-gray-600 sm:text-lg">
                Plan, track, and ship—without switching tabs. Real‑time boards, powerful automations, and enterprise‑grade security.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Get started — it’s free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
                  onClick={() => alert("Play product video")}
                >
                  <PlayCircle className="h-5 w-5" /> Watch video
                </button>
              </div>

              <div className="flex items-center gap-6 pt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1"><Check className="h-4 w-4" /> No credit card</div>
                <div className="flex items-center gap-1"><Check className="h-4 w-4" /> Free forever plan</div>
              </div>
            </div>

            {/* Floating board preview */}
            <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
              <div className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="text-xs text-gray-500">Realtime Board</div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { title: "To Do", color: "bg-slate-50" },
                    { title: "In Progress", color: "bg-indigo-50" },
                    { title: "Done", color: "bg-emerald-50" },
                  ].map((col, i) => (
                    <div key={i} className={`rounded-xl ${col.color} p-3 border border-gray-100`}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">{col.title}</span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-gray-500 shadow">{i === 2 ? 8 : i === 1 ? 4 : 5}</span>
                      </div>
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="mb-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-gray-800">Card {n}</p>
                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">{i === 0 ? "Low" : i === 1 ? "Med" : "High"}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500">Description preview for this card with tiny details…</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Logos */}
      <section ref={addToStagger} className="border-y border-gray-100 bg-white/60 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-gray-500">
            Trusted by modern teams
          </p>
          <div className="grid grid-cols-3 items-center gap-6 opacity-90 sm:grid-cols-6">
            {logos.map((l) => (
              <div key={l} className="flex items-center justify-center rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm">
                {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={addToStagger} className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-center justify-between gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Everything you need to move work forward</h2>
          <Link to="/register" className="hidden rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 sm:inline-flex items-center gap-2">
            Explore product <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article key={f.title} className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                {f.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 opacity-0 transition group-hover:opacity-100">
                Learn more <ArrowRight className="h-4 w-4" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section ref={addToStagger} className="bg-gradient-to-b from-white to-indigo-50/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Built for every team</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {useCases.map((c) => (
              <div key={c.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <span className="mb-2 inline-block rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-700">{c.badge}</span>
                <h3 className="mb-2 text-base font-semibold text-gray-900">{c.title}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600" />{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section ref={addToStagger} className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Connect your stack</h2>
          <button className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 sm:inline-flex">
            View all integrations <Link2 className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {integrations.map((i) => (
            <div key={i.name} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-700">{i.icon}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{i.name}</p>
                <p className="text-xs text-gray-500">One‑click connection</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section ref={addToStagger} className="bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Loved by product teams</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <figure
                key={t.name}
                className={`relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition ${idx === activeTestimonial ? "ring-2 ring-indigo-500" : "opacity-90"
                  }`}
              >
                <p className="text-sm text-gray-700">“{t.quote}”</p>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                    {t.name.split(" ").map((s) => s[0]).join("")}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full ${i === activeTestimonial ? "bg-indigo-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={addToStagger} className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-90" />
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-white/10 p-8 text-white shadow-lg ring-1 ring-white/20 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-bold">Bring clarity to your team, today</h3>
              <p className="mt-1 text-white/80">Create your first board in seconds. No credit card required.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-gray-100">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
