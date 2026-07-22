"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Input } from "@/components/ds";
import { ApiError, useAuth } from "@/lib/auth";

// Deliberately no role selector — public sign-up always creates a Consumer (FR-16);
// providers are created/promoted by an admin (report §6.4 prompt J).
function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(email, password, fullName || undefined);
      // FR-2: return the user to the booking flow they came from, if any.
      const redirect = searchParams.get("redirect");
      router.replace(redirect && redirect.startsWith("/") ? redirect : "/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Card title="Create your account" description="Book appointments with BookIt">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <Input
              id="fullName"
              label="Full name"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint="Must be at least 8 characters"
            />
            {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating account…" : "Sign up"}
            </Button>
          </form>
          <p className="text-sm mt-4" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/sign-in" style={{ color: "var(--color-primary)" }}>
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
