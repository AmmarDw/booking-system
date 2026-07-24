import Link from "next/link";
import { Accordion, Button, Card } from "@/components/ds";

// Services change via admin CRUD (M5) — always fetch fresh rather than baking data in at build time.
export const dynamic = "force-dynamic";

interface ServiceSummary {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
}

async function getServicesPreview(): Promise<ServiceSummary[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  try {
    const res = await fetch(`${baseUrl}/api/services`);
    if (!res.ok) return [];
    const services = (await res.json()) as ServiceSummary[];
    return services.slice(0, 3);
  } catch {
    // Backend unreachable — the landing page should still render.
    return [];
  }
}

// Icon-in-circle + numbered-corner-badge treatment, matching the Claude Design landing page
// mockup exactly (fetched via DesignSync): magnifier / calendar / person / checkmark.
const STEP_ICON_PATHS: React.ReactNode[] = [
  <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  <><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 5-5" /></>,
];

const HOW_IT_WORKS = [
  { step: 1, title: "Browse services", desc: "See what's on offer — no account needed." },
  { step: 2, title: "Pick a date", desc: "Check real availability on the calendar." },
  { step: 3, title: "Choose a provider slot", desc: "Compare providers and pick a time that works." },
  { step: 4, title: "Confirm & get a Meet link", desc: "We email your confirmation with a video link." },
];

const FAQ = [
  {
    title: "Do I need an account to browse services?",
    content: "No — browsing is open to everyone. You'll only be asked to sign in when you book.",
  },
  {
    title: "How do I join my appointment?",
    content: "Your confirmation email includes a Google Meet link for the exact time you booked.",
  },
  {
    title: "Can I book with a specific provider?",
    content: "Yes — after picking a date, you'll see each available provider's open times to choose from.",
  },
];

// Our real services don't match the design mockup's generic "consulting" categories, so these are
// our own icon picks in the same visual treatment (40x40 tinted box, 20x20 stroke icon), keyed by
// a substring match on the service name with a sensible fallback for anything admin-added later.
function serviceIconPaths(name: string): React.ReactNode {
  const n = name.toLowerCase();
  if (n.includes("dental")) return <><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01M15 9h.01" /></>;
  if (n.includes("physio")) return <path d="M22 12h-4l-3 9L9 3l-3 9H2" />;
  if (n.includes("dermatology") || n.includes("skin")) return <path d="M12 2s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />;
  if (n.includes("nutrition")) return <><circle cx="12" cy="13" r="7" /><path d="M12 6c0-2 1-3 3-3" /></>;
  if (n.includes("gym") || n.includes("fitness")) return <><rect x="2" y="8" width="3" height="8" rx="1" /><rect x="19" y="8" width="3" height="8" rx="1" /><path d="M5 12h14" /><rect x="7" y="10" width="2" height="4" /><rect x="15" y="10" width="2" height="4" /></>;
  // General consultation / fallback: a speech bubble, for "talk to someone".
  return <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />;
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export default async function Home() {
  const services = await getServicesPreview();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center px-6 py-20" style={{ background: "var(--color-primary-tint-weak)" }}>
        <h1 className="text-3xl sm:text-4xl font-bold max-w-2xl" style={{ color: "var(--text-primary)" }}>
          Book appointments with ease
        </h1>
        <p className="max-w-xl text-lg" style={{ color: "var(--text-secondary)" }}>
          Browse services, pick a time that works, and get a confirmation with a video link —
          all in a few clicks.
        </p>
        <Link href="/book">
          <Button size="lg">Book now</Button>
        </Link>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-semibold text-center mb-10" style={{ color: "var(--text-primary)" }}>
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center gap-3">
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-primary-tint)",
                  color: "var(--color-primary)",
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  {STEP_ICON_PATHS[item.step - 1]}
                </svg>
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    insetInlineEnd: -4,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--color-primary)",
                    color: "var(--text-on-primary)",
                    fontSize: 11,
                    fontWeight: "var(--weight-bold)" as React.CSSProperties["fontWeight"],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.step}
                </span>
              </div>
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Services preview */}
      {services.length > 0 && (
        <section className="px-6 py-16" style={{ background: "var(--surface-sunken)" }}>
          <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-2xl font-semibold text-center mb-10" style={{ color: "var(--text-primary)" }}>
              Popular services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} title={service.name} description={service.description}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-primary-tint)",
                      color: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      {serviceIconPaths(service.name)}
                    </svg>
                  </div>
                  <p className="text-sm mt-2 flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                    <ClockIcon />
                    {service.durationMinutes} min
                  </p>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/book">
                <Button variant="secondary">View all services</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="px-6 py-16 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-semibold text-center mb-10" style={{ color: "var(--text-primary)" }}>
          Frequently asked questions
        </h2>
        <Accordion items={FAQ} />
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sm border-t" style={{ borderColor: "var(--border-default)", color: "var(--text-tertiary)" }}>
        © {new Date().getFullYear()} BookIt
      </footer>
    </div>
  );
}
