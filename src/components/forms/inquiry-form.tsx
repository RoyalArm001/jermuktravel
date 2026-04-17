"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const tripStyles = [
  { value: "", label: "Choose a travel style" },
  { value: "WELLNESS", label: "Wellness" },
  { value: "ADVENTURE", label: "Adventure" },
  { value: "FAMILY", label: "Family" },
  { value: "ROMANTIC", label: "Romantic" },
  { value: "WORKATION", label: "Workation" },
  { value: "CUSTOM", label: "Custom" },
] as const;

export function InquiryForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [travelWindow, setTravelWindow] = useState("");
  const [guests, setGuests] = useState("2");
  const [tripStyle, setTripStyle] = useState("");
  const [destinationLabel, setDestinationLabel] = useState("");
  const [packageLabel, setPackageLabel] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsPending(true);

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        phone,
        travelWindow,
        guests,
        tripStyle,
        destinationLabel,
        packageLabel,
        message,
      }),
    });

    const payload = (await response.json()) as { error?: string; message?: string };

    if (!response.ok) {
      setError(payload.error ?? "Unable to save the inquiry.");
      setIsPending(false);
      return;
    }

    setSuccess(payload.message ?? "Inquiry saved.");
    setFullName("");
    setEmail("");
    setPhone("");
    setTravelWindow("");
    setGuests("2");
    setTripStyle("");
    setDestinationLabel("");
    setPackageLabel("");
    setMessage("");
    setIsPending(false);
  }

  return (
    <section className="glass-card rounded-[2.25rem] p-7">
      <span className="section-kicker">Inquiry capture</span>
      <h2 className="mt-4 font-display text-5xl leading-none text-ink">
        Send a planning request
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-8 text-stone">
        This form saves traveler interest directly to the database so your team
        can follow up with an itinerary, pricing, and logistics.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inquiry-name" className="mb-2 block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              id="inquiry-name"
              className="form-field"
              type="text"
              placeholder="Guest full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="inquiry-email" className="mb-2 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="inquiry-email"
              className="form-field"
              type="email"
              placeholder="guest@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="inquiry-phone" className="mb-2 block text-sm font-medium text-ink">
              Phone
            </label>
            <input
              id="inquiry-phone"
              className="form-field"
              type="tel"
              placeholder="+374 ..."
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="inquiry-window" className="mb-2 block text-sm font-medium text-ink">
              Travel window
            </label>
            <input
              id="inquiry-window"
              className="form-field"
              type="text"
              placeholder="May 2026"
              value={travelWindow}
              onChange={(event) => setTravelWindow(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="inquiry-guests" className="mb-2 block text-sm font-medium text-ink">
              Guests
            </label>
            <input
              id="inquiry-guests"
              className="form-field"
              type="number"
              min={1}
              max={12}
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inquiry-style" className="mb-2 block text-sm font-medium text-ink">
              Travel style
            </label>
            <select
              id="inquiry-style"
              className="form-field"
              value={tripStyle}
              onChange={(event) => setTripStyle(event.target.value)}
            >
              {tripStyles.map((style) => (
                <option key={style.label} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="inquiry-destination" className="mb-2 block text-sm font-medium text-ink">
              Destination focus
            </label>
            <input
              id="inquiry-destination"
              className="form-field"
              type="text"
              placeholder="Jermuk wellness retreat"
              value={destinationLabel}
              onChange={(event) => setDestinationLabel(event.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="inquiry-package" className="mb-2 block text-sm font-medium text-ink">
            Package idea
          </label>
          <input
            id="inquiry-package"
            className="form-field"
            type="text"
            placeholder="Mountain Breath Retreat"
            value={packageLabel}
            onChange={(event) => setPackageLabel(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="inquiry-message" className="mb-2 block text-sm font-medium text-ink">
            Trip details
          </label>
          <textarea
            id="inquiry-message"
            className="form-field min-h-36 resize-y"
            placeholder="Tell us about dates, guest needs, room preferences, transfers, or special wellness requests."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
        </div>

        {error ? (
          <p className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        ) : null}

        <button type="submit" className="primary-button w-full" disabled={isPending}>
          {isPending ? "Saving inquiry..." : "Save inquiry"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </section>
  );
}
