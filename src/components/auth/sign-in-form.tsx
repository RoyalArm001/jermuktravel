"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

type SignInFormProps = {
  googleEnabled: boolean;
};

export function SignInForm({ googleEnabled }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleCredentialsSignIn(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setIsPending(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/account",
    });

    if (result?.error) {
      setError("We could not sign you in with those credentials.");
      setIsPending(false);
      return;
    }

    router.push(result?.url ?? "/account");
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setError("");
    setIsPending(true);
    await signIn("google", {
      callbackUrl: "/account",
    });
  }

  return (
    <div>
      <span className="section-kicker">Traveler sign in</span>
      <h2 className="mt-4 font-display text-5xl leading-none text-ink">
        Welcome back
      </h2>
      <p className="mt-4 max-w-xl text-base leading-8 text-stone">
        Sign in to manage inquiries, return to your travel account, and keep
        your planning details in one place.
      </p>

      <form onSubmit={handleCredentialsSignIn} className="mt-8 space-y-4">
        <div>
          <label htmlFor="sign-in-email" className="mb-2 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="sign-in-email"
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
          <label htmlFor="sign-in-password" className="mb-2 block text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="sign-in-password"
            className="form-field"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
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
          {isPending ? "Signing in..." : "Sign in with email"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {googleEnabled ? (
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="secondary-button mt-4 w-full"
          disabled={isPending}
        >
          Continue with Google
        </button>
      ) : (
        <p className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm leading-7 text-stone">
          Google sign-in will appear here as soon as `GOOGLE_CLIENT_ID` and
          `GOOGLE_CLIENT_SECRET` are added to your environment.
        </p>
      )}
    </div>
  );
}
