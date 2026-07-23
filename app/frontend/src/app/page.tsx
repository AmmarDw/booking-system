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
            <div key={item.step} className="flex flex-col items-start gap-2">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-full font-semibold"
                style={{ background: "var(--color-primary)", color: "var(--text-on-primary)" }}
              >
                {item.step}
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
                  <p className="text-sm mt-2" style={{ color: "var(--text-tertiary)" }}>
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
