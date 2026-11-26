"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";

interface ContactFormProps {
  dict: Dictionary["contactPage"]["form"];
}

interface FormState {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  description: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  description: "",
};

export function ContactForm({ dict }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedMode, setSubmittedMode] = useState<"email" | "development_fallback" | null>(
    null
  );

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) {
      nextErrors.name = dict.errors.nameRequired;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = dict.errors.emailInvalid;
    }
    if (!form.service.trim()) {
      nextErrors.service = dict.errors.serviceRequired;
    }
    if (!form.description.trim() || form.description.trim().length < 10) {
      nextErrors.description = dict.errors.descriptionRequired;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setServerError(data.error || dict.errors.genericError);
        return;
      }

      setSubmittedMode(data.mode || "development_fallback");
      setForm(initialState);
      setErrors({});
    } catch {
      setServerError(dict.errors.genericError);
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedMode) {
    return (
      <div className="bg-white border border-[#111318]/12 p-8 sm:p-10">
        <div className="flex items-start gap-4 mb-6">
          <CheckCircle2 className="w-6 h-6 text-[#8291EA] shrink-0 mt-0.5" />
          <div>
            <h2 className="font-display text-2xl font-medium text-[#111318] mb-2">
              {dict.successTitle}
            </h2>
            <p className="text-[#777777] text-base leading-relaxed">
              {dict.successMessage}
            </p>
          </div>
        </div>

        {submittedMode === "development_fallback" && (
          <p className="text-xs font-mono text-[#777777] bg-[#F5F5F2] border border-[#111318]/10 p-3.5 mb-6">
            {dict.devNote}
          </p>
        )}

        <button
          type="button"
          onClick={() => setSubmittedMode(null)}
          className="px-6 py-3 border border-[#111318] text-[#111318] text-sm font-medium hover:bg-[#111318] hover:text-white transition-colors"
        >
          {dict.resetButton}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white border border-[#111318]/12 p-7 sm:p-10 space-y-6"
    >
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-900 text-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label
            htmlFor="contact-name"
            className="block text-xs font-mono uppercase tracking-[0.12em] text-[#111318] mb-2"
          >
            {dict.nameLabel} *
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={dict.namePlaceholder}
            aria-invalid={Boolean(errors.name)}
            className="w-full px-4 py-3 bg-[#F5F5F2]/70 border border-[#111318]/15 text-[#111318] text-sm placeholder:text-[#777777]/60 focus:outline-none focus:border-[#8291EA] focus:bg-white transition-colors"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Business Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="block text-xs font-mono uppercase tracking-[0.12em] text-[#111318] mb-2"
          >
            {dict.emailLabel} *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder={dict.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            className="w-full px-4 py-3 bg-[#F5F5F2]/70 border border-[#111318]/15 text-[#111318] text-sm placeholder:text-[#777777]/60 focus:outline-none focus:border-[#8291EA] focus:bg-white transition-colors"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Company */}
        <div>
          <label
            htmlFor="contact-company"
            className="block text-xs font-mono uppercase tracking-[0.12em] text-[#111318] mb-2"
          >
            {dict.companyLabel}
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder={dict.companyPlaceholder}
            className="w-full px-4 py-3 bg-[#F5F5F2]/70 border border-[#111318]/15 text-[#111318] text-sm placeholder:text-[#777777]/60 focus:outline-none focus:border-[#8291EA] focus:bg-white transition-colors"
          />
        </div>

        {/* Service Required */}
        <div>
          <label
            htmlFor="contact-service"
            className="block text-xs font-mono uppercase tracking-[0.12em] text-[#111318] mb-2"
          >
            {dict.serviceLabel} *
          </label>
          <select
            id="contact-service"
            name="service"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            aria-invalid={Boolean(errors.service)}
            className="w-full px-4 py-3 bg-[#F5F5F2]/70 border border-[#111318]/15 text-[#111318] text-sm focus:outline-none focus:border-[#8291EA] focus:bg-white transition-colors"
          >
            <option value="">{dict.servicePlaceholder}</option>
            {dict.serviceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-1.5 text-xs text-red-600">{errors.service}</p>
          )}
        </div>
      </div>

      {/* Estimated Budget (Optional) */}
      <div>
        <label
          htmlFor="contact-budget"
          className="block text-xs font-mono uppercase tracking-[0.12em] text-[#111318] mb-2"
        >
          {dict.budgetLabel}{" "}
          <span className="text-[#777777] normal-case tracking-normal">
            {dict.budgetOptional}
          </span>
        </label>
        <select
          id="contact-budget"
          name="budget"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          className="w-full px-4 py-3 bg-[#F5F5F2]/70 border border-[#111318]/15 text-[#111318] text-sm focus:outline-none focus:border-[#8291EA] focus:bg-white transition-colors"
        >
          <option value="">{dict.budgetPlaceholder}</option>
          {dict.budgetOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Project Description */}
      <div>
        <label
          htmlFor="contact-description"
          className="block text-xs font-mono uppercase tracking-[0.12em] text-[#111318] mb-2"
        >
          {dict.descriptionLabel} *
        </label>
        <textarea
          id="contact-description"
          name="description"
          rows={5}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder={dict.descriptionPlaceholder}
          aria-invalid={Boolean(errors.description)}
          className="w-full px-4 py-3 bg-[#F5F5F2]/70 border border-[#111318]/15 text-[#111318] text-sm placeholder:text-[#777777]/60 focus:outline-none focus:border-[#8291EA] focus:bg-white transition-colors resize-y"
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#8291EA] text-[#111318] font-medium text-sm tracking-wide hover:bg-[#6e7fe3] disabled:opacity-60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111318]"
        >
          <span>{submitting ? dict.submittingButton : dict.submitButton}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
