import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  company?: string;
  service?: string;
  budget?: string;
  description?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const company = body.company?.trim() || "N/A";
    const service = body.service?.trim() || "";
    const budget = body.budget?.trim() || "Not specified";
    const description = body.description?.trim() || "";

    if (!name || !email || !service || description.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipient =
      process.env.CONTACT_RECIPIENT_EMAIL || "kartagotechagency@gmail.com";

    if (resendApiKey) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "KartagoTech Website <onboarding@resend.dev>",
          to: [recipient],
          reply_to: email,
          subject: `[KartagoTech Inquiry] ${service} — ${name}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Company: ${company}`,
            `Service: ${service}`,
            `Budget: ${budget}`,
            "",
            "Description:",
            description,
          ].join("\n"),
        }),
      });

      if (!resendRes.ok) {
        const errText = await resendRes.text();
        console.error("[Contact API] Resend delivery failed:", errText);
        return NextResponse.json(
          { ok: false, error: "Email delivery service failed." },
          { status: 502 }
        );
      }

      return NextResponse.json({ ok: true, mode: "email" });
    }

    // Development / unconfigured fallback: log inquiry cleanly without failing
    console.info("[KartagoTech Contact Inquiry - Dev Fallback]", {
      timestamp: new Date().toISOString(),
      recipient,
      name,
      email,
      company,
      service,
      budget,
      description,
    });

    return NextResponse.json({ ok: true, mode: "development_fallback" });
  } catch (error) {
    console.error("[Contact API] Unexpected error:", error);
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
