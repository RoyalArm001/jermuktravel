"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

type SignUpFormProps = {
  googleEnabled: boolean;
};

export function SignUpForm({ googleEnabled }: SignUpFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsPending(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
      }),
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Unable to create the account right now.");
      setIsPending(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/account",
    });

    if (signInResult?.error) {
      setError("Account created, but automatic sign in failed. Please sign in manually.");
      setIsPending(false);
      return;
    }

    router.push(signInResult?.url ?? "/account");
    router.refresh();
  }

  async function handleGoogleSignUp() {
    setError("");
    setIsPending(true);
    await signIn("google", {
      callbackUrl: "/account",
    });
  }

  return (
    <div>
      <span className="section-kicker">New traveler account</span>
      <h2 className="mt-4 font-display text-5xl leading-none text-ink">
        Create your account
      </h2>
      <p className="mt-4 max-w-xl text-base leading-8 text-stone">
        Save traveler details, keep inquiries linked to the guest, and prepare
        the site for a cleaner booking process.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="sign-up-name" className="mb-2 block text-sm font-medium text-ink">
            Full name
          </label>
          <input
            id="sign-up-name"
            className="form-field"
            type="text"
            autoComplete="name"
            placeholder="Guest full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sign-up-email" className="mb-2 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="sign-up-email"
              className="form-field"
              type="email"
              autoComplete="email"
              placeholder="guest@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="sign-up-phone" className="mb-2 block text-sm font-medium text-ink">
              Phone
            </label>
            <input
              id="sign-up-phone"
              className="form-field"
              type="tel"
              autoComplete="tel"
              placeholder="+374 ..."
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="sign-up-password" className="mb-2 block text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="sign-up-password"
            className="form-field"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error ? (
          <p className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button type="submit" className="primary-button w-full" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account with email"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {googleEnabled ? (
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="secondary-button mt-4 w-full"
          disabled={isPending}
        >
          Continue with Google
        </button>
      ) : (
        <p className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm leading-7 text-stone">
          Google sign-up is ready in the codebase. Add the Google OAuth keys in
          `.env` and the button will work immediately.
        </p>
      )}
    </div>
  );
}
