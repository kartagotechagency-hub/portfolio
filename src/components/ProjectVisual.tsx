import React from "react";
import {
  QrCode,
  Printer,
  Bot,
  Code2,
  Scale,
  FileSearch,
  Globe,
  BookOpen,
  PhoneCall,
  AudioLines,
  Workflow,
  FileSpreadsheet,
  Monitor,
  Smartphone,
} from "lucide-react";

interface ProjectVisualProps {
  type:
    | "restaurant"
    | "chatbotpro"
    | "lexassist"
    | "elearning"
    | "voice-agent"
    | "rpa-workflow"
    | "rpa-platform";
  mockupLabel: string;
  className?: string;
}

/**
 * Editorial, Swiss-styled system previews for KartagoTech's portfolio projects.
 */
export function ProjectVisual({
  type,
  mockupLabel,
  className = "",
}: ProjectVisualProps) {
  return (
    <div
      className={`relative w-full aspect-[16/10] bg-[#111318] border border-[#111318]/15 overflow-hidden select-none group ${className}`}
    >
      {/* Top status bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-[#111318]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8291EA]" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] text-white/75">
            {mockupLabel}
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/40 hidden sm:inline">
          KARTAGOTECH // SYSTEM
        </span>
      </div>

      {/* Visual Body */}
      <div className="relative z-10 h-[calc(100%-41px)] p-4 sm:p-6 md:p-8 flex items-center justify-center">
        {type === "restaurant" && <RestaurantMockup />}
        {type === "chatbotpro" && <ChatbotProMockup />}
        {type === "lexassist" && <LexAssistMockup />}
        {type === "elearning" && <ElearningMockup />}
        {type === "voice-agent" && <VoiceAgentMockup />}
        {type === "rpa-workflow" && <RpaWorkflowMockup />}
        {type === "rpa-platform" && <RpaPlatformMockup />}
      </div>
    </div>
  );
}

function RestaurantMockup() {
  return (
    <div className="w-full h-full grid grid-cols-12 gap-3 sm:gap-4 transition-transform duration-500 group-hover:scale-[1.015]">
      <div className="col-span-5 bg-[#F5F5F2] text-[#111318] p-3 sm:p-4 flex flex-col justify-between border border-white/10">
        <div>
          <div className="flex items-center justify-between border-b border-[#111318]/10 pb-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777]">
              QR Table · 08
            </span>
            <QrCode className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
          </div>
          <p className="text-xs sm:text-sm font-semibold tracking-tight mb-2">
            Order Management
          </p>
          <div className="space-y-1.5 text-[10px] sm:text-[11px]">
            <div className="flex justify-between py-1 border-b border-[#111318]/8">
              <span>2x Entrée Saison</span>
              <span className="font-mono text-[#777777]">PREP</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#111318]/8">
              <span>1x Plat Signature</span>
              <span className="font-mono text-[#8291EA]">KDS</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Table 08 · Dine-In</span>
              <span className="font-mono text-[#111318]">PAID</span>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-[#111318]/10 flex items-center justify-between text-[10px] font-mono text-[#777777]">
          <span>ORDER SYNC</span>
          <span className="text-[#111318] font-medium">ACTIVE</span>
        </div>
      </div>

      <div className="col-span-7 bg-[#1A1D24] border border-white/12 p-3 sm:p-4 flex flex-col justify-between text-white">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">
              Kitchen Display (KDS)
            </span>
            <Printer className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="border border-white/10 bg-[#111318] p-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8291EA] mb-1.5">
                <span>TICKET #104</span>
                <span>04:12</span>
              </div>
              <div className="space-y-1 text-[10px] text-white/80">
                <p>• Table 04 — Main</p>
                <p>• Table 04 — Side</p>
              </div>
            </div>
            <div className="border border-white/10 bg-[#111318] p-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-1.5">
                <span>RECEIPT #105</span>
                <span>PRINT</span>
              </div>
              <div className="space-y-1 text-[10px] text-white/80">
                <p>• QR Takeaway</p>
                <p>• Thermal queued</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
          <span className="text-white/50">SALES REPORTING</span>
          <span className="px-2 py-0.5 bg-[#8291EA]/15 text-[#8291EA] border border-[#8291EA]/30">
            SHIFT SUMMARY
          </span>
        </div>
      </div>
    </div>
  );
}

function ChatbotProMockup() {
  return (
    <div className="w-full h-full grid grid-cols-12 gap-3 sm:gap-4 transition-transform duration-500 group-hover:scale-[1.015]">
      <div className="col-span-6 bg-[#1A1D24] border border-white/12 p-3 sm:p-4 flex flex-col justify-between text-white">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">
              Tenant Workspace
            </span>
            <Code2 className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
          </div>
          <div className="space-y-2 text-[10px] sm:text-[11px] mb-3">
            <div className="flex items-center justify-between p-2 border border-[#8291EA]/40 bg-[#8291EA]/10">
              <span>Brand Accent</span>
              <span className="font-mono text-[#8291EA]">#8291EA</span>
            </div>
            <div className="p-2 border border-white/10 bg-[#111318] font-mono text-[9px] sm:text-[10px] text-white/80 leading-relaxed overflow-hidden">
              {`<script src="cdn.chatbotpro.io/w.js"`}
              <br />
              {`  data-tenant="org_94a2" async />`}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[10px] font-mono text-white/50">
          <span>ISOLATED TENANT</span>
          <span className="text-[#8291EA]">HTML/JS SNIPPET</span>
        </div>
      </div>

      <div className="col-span-6 bg-[#F5F5F2] text-[#111318] p-3 sm:p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#111318]/10 pb-2">
          <div className="flex items-center gap-2">
            <Bot className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
            <span className="text-xs font-semibold">ChatbotPro Widget</span>
          </div>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[#111318] text-white">
            LIVE
          </span>
        </div>

        <div className="space-y-2.5 my-2 text-[10px] sm:text-[11px]">
          <div className="bg-white border border-[#111318]/10 p-2 ml-6">
            <p>Can we customize the assistant per domain?</p>
          </div>
          <div className="bg-[#111318] text-white p-2.5 mr-4">
            <p className="text-white/90 leading-relaxed">
              Yes. Each tenant has isolated docs, tone, and one-line JS embed.
            </p>
          </div>
        </div>

        <div className="border-t border-[#111318]/10 pt-2 flex items-center justify-between text-[10px] font-mono text-[#777777]">
          <span>MULTI-TENANT SAAS</span>
          <span className="text-[#111318]">EMBEDDED</span>
        </div>
      </div>
    </div>
  );
}

function LexAssistMockup() {
  return (
    <div className="w-full h-full grid grid-cols-12 gap-3 sm:gap-4 transition-transform duration-500 group-hover:scale-[1.015]">
      <div className="col-span-5 bg-[#1A1D24] border border-white/12 p-3 sm:p-4 flex flex-col justify-between text-white">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">
              Local Vault
            </span>
            <Scale className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
          </div>
          <div className="space-y-2 text-[10px] sm:text-[11px]">
            <div className="p-2 border border-[#8291EA]/40 bg-[#8291EA]/10">
              <p className="font-mono text-[9px] text-[#8291EA] mb-0.5">
                CLIENT DOSSIER
              </p>
              <p className="text-white/90 truncate">Commercial Lease §4.2</p>
            </div>
            <div className="p-2 border border-white/10 bg-[#111318]">
              <p className="font-mono text-[9px] text-white/40 mb-0.5">
                LOCAL RAG INDEX
              </p>
              <p className="text-white/75 truncate">Case_Brief_2026.pdf</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[10px] font-mono text-white/50">
          <span>ON-DEVICE</span>
          <span className="text-[#8291EA]">PRIVATE</span>
        </div>
      </div>

      <div className="col-span-7 bg-[#F5F5F2] text-[#111318] p-3 sm:p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#111318]/10 pb-2">
          <div className="flex items-center gap-2">
            <FileSearch className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
            <span className="text-xs font-semibold">LexAssist Desktop</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 border border-[#111318]/20 text-[#777777]">
            <Globe className="w-2.5 h-2.5" /> WEB: OPT
          </span>
        </div>

        <div className="space-y-2 my-2 text-[10px] sm:text-[11px]">
          <div className="bg-white border border-[#111318]/10 p-2.5">
            <p className="text-[#111318] leading-relaxed">
              Notice period requires 90 days written delivery prior to renewal.
            </p>
            <p className="mt-1.5 text-[9px] font-mono text-[#8291EA]">
              CITE: Lease_Agreement.pdf · Page 12, Clause 4.2
            </p>
          </div>
        </div>

        <div className="border-t border-[#111318]/10 pt-2 flex items-center justify-between text-[10px] font-mono text-[#777777]">
          <span>SOURCE CITATIONS</span>
          <span className="text-[#111318]">VERIFIED</span>
        </div>
      </div>
    </div>
  );
}

function ElearningMockup() {
  return (
    <div className="w-full h-full grid grid-cols-12 gap-3 sm:gap-4 transition-transform duration-500 group-hover:scale-[1.015]">
      <div className="col-span-5 bg-[#F5F5F2] text-[#111318] p-3 sm:p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[#111318]/10 pb-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777]">
              WordPress + LMS
            </span>
            <Globe className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
          </div>
          <p className="text-xs sm:text-sm font-semibold tracking-tight mb-2">
            Course Catalog
          </p>
          <div className="space-y-2 text-[10px] sm:text-[11px]">
            <div className="p-2 bg-white border border-[#111318]/10">
              <p className="font-medium">WordPress LMS Plugin</p>
              <p className="text-[#777777] text-[9px] font-mono mt-0.5">
                MODULES · QUIZZES
              </p>
            </div>
            <div className="p-2 bg-white border border-[#111318]/10">
              <p className="font-medium">Learner Portal</p>
              <p className="text-[#777777] text-[9px] font-mono mt-0.5">
                ENROLLMENT · ACCESS
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#111318]/10 pt-2 flex items-center justify-between text-[10px] font-mono text-[#777777]">
          <span>CMS + PLUGINS</span>
          <span className="text-[#111318]">WORDPRESS</span>
        </div>
      </div>

      <div className="col-span-7 bg-[#1A1D24] border border-white/12 p-3 sm:p-4 flex flex-col justify-between text-white">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">
              ManyChat Social Automation
            </span>
            <BookOpen className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
          </div>
          <div className="border border-[#8291EA]/40 bg-[#8291EA]/10 p-3 mb-2.5">
            <p className="text-[9px] font-mono text-[#8291EA] mb-1">
              TRIGGER // SOCIAL DM & COMMENT
            </p>
            <p className="text-xs text-white/90">
              Auto-qualify lead → Send course registration link
            </p>
          </div>
          <div className="space-y-1.5 text-[10px] text-white/75">
            <div className="flex justify-between">
              <span>01. Social Inquiry</span>
              <span className="font-mono text-[#8291EA]">MANYCHAT</span>
            </div>
            <div className="flex justify-between">
              <span>02. Course Onboarding</span>
              <span className="font-mono text-white/60">WP LMS</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[10px] font-mono">
          <span className="text-white/50">SOCIAL FUNNEL</span>
          <span className="text-[#8291EA]">AUTOMATED</span>
        </div>
      </div>
    </div>
  );
}

function VoiceAgentMockup() {
  return (
    <div className="w-full h-full grid grid-cols-12 gap-3 sm:gap-4 transition-transform duration-500 group-hover:scale-[1.015]">
      <div className="col-span-5 bg-[#1A1D24] border border-white/12 p-3 sm:p-4 flex flex-col justify-between text-white">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">
              SIP Telephony
            </span>
            <PhoneCall className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
          </div>
          <div className="space-y-2 text-[10px] sm:text-[11px]">
            <div className="p-2 border border-white/10 bg-[#111318] flex items-center justify-between">
              <span>Asterisk Trunk</span>
              <span className="font-mono text-[#8291EA]">RTP</span>
            </div>
            <div className="p-2 border border-white/10 bg-[#111318] flex items-center justify-between">
              <span>FastAPI Bridge</span>
              <span className="font-mono text-white/70">WS</span>
            </div>
            <div className="p-2 border border-[#8291EA]/40 bg-[#8291EA]/10 flex items-center justify-between">
              <span>OpenAI Realtime</span>
              <span className="font-mono text-[#8291EA]">STREAM</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[10px] font-mono text-white/50">
          <span>AUDIO BRIDGE</span>
          <span className="text-[#8291EA]">FULL-DUPLEX</span>
        </div>
      </div>

      <div className="col-span-7 bg-[#F5F5F2] text-[#111318] p-3 sm:p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#111318]/10 pb-2">
          <div className="flex items-center gap-2">
            <AudioLines className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
            <span className="text-xs font-semibold">Realtime Voice Session</span>
          </div>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[#111318] text-white">
            ACTIVE CALL
          </span>
        </div>

        <div className="my-2 p-3 bg-[#111318] flex items-center justify-center gap-1.5 h-16">
          {[35, 70, 45, 90, 60, 80, 40, 65, 85, 50, 75, 35].map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className={`w-1.5 ${i % 3 === 0 ? "bg-[#8291EA]" : "bg-white/60"}`}
            />
          ))}
        </div>

        <div className="space-y-1 text-[10px] font-mono text-[#777777]">
          <div className="flex justify-between">
            <span>VAD + BARGE-IN</span>
            <span className="text-[#111318]">ENABLED</span>
          </div>
          <div className="flex justify-between">
            <span>SESSION STATE</span>
            <span className="text-[#8291EA]">LISTENING</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RpaWorkflowMockup() {
  return (
    <div className="w-full h-full grid grid-cols-12 gap-3 sm:gap-4 transition-transform duration-500 group-hover:scale-[1.015]">
      <div className="col-span-6 bg-[#1A1D24] border border-white/12 p-3 sm:p-4 flex flex-col justify-between text-white">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">
              RPA Execution Pipeline
            </span>
            <Workflow className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
          </div>
          <div className="space-y-2 text-[10px] sm:text-[11px]">
            <div className="p-2 border border-white/10 bg-[#111318] flex justify-between">
              <span>01. Browser Automation</span>
              <span className="font-mono text-[#8291EA]">DOM</span>
            </div>
            <div className="p-2 border border-white/10 bg-[#111318] flex justify-between">
              <span>02. Document Processing</span>
              <span className="font-mono text-white/65">PDF/XLS</span>
            </div>
            <div className="p-2 border border-[#8291EA]/40 bg-[#8291EA]/10 flex justify-between">
              <span>03. Automated Data Entry</span>
              <span className="font-mono text-[#8291EA]">VERIFIED</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[10px] font-mono text-white/50">
          <span>REPETITIVE TASKS</span>
          <span className="text-[#8291EA]">AUTOMATED</span>
        </div>
      </div>

      <div className="col-span-6 bg-[#F5F5F2] text-[#111318] p-3 sm:p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#111318]/10 pb-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
            <span className="text-xs font-semibold">Workflow & Reporting</span>
          </div>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[#111318] text-white">
            BATCH
          </span>
        </div>

        <div className="space-y-2 my-2 text-[10px] sm:text-[11px]">
          <div className="p-2 bg-white border border-[#111318]/10 flex justify-between">
            <span>Invoice Extraction</span>
            <span className="font-mono text-[#8291EA]">QUEUED</span>
          </div>
          <div className="p-2 bg-white border border-[#111318]/10 flex justify-between">
            <span>Scheduled Report Export</span>
            <span className="font-mono text-[#111318]">CSV / PDF</span>
          </div>
        </div>

        <div className="border-t border-[#111318]/10 pt-2 flex items-center justify-between text-[10px] font-mono text-[#777777]">
          <span>WORKFLOW BOT</span>
          <span className="text-[#111318]">SCHEDULED</span>
        </div>
      </div>
    </div>
  );
}

function RpaPlatformMockup() {
  return (
    <div className="w-full h-full grid grid-cols-12 gap-3 sm:gap-4 transition-transform duration-500 group-hover:scale-[1.015]">
      <div className="col-span-5 bg-[#1A1D24] border border-white/12 p-3 sm:p-4 flex flex-col justify-between text-white">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">
              Target Surfaces
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#8291EA]/20 text-[#8291EA] border border-[#8291EA]/40">
              IN DEV
            </span>
          </div>
          <div className="space-y-2 text-[10px] sm:text-[11px]">
            <div className="p-2 border border-white/10 bg-[#111318] flex items-center gap-2">
              <Monitor className="w-3 h-3 text-[#8291EA]" />
              <span>Desktop Apps</span>
            </div>
            <div className="p-2 border border-white/10 bg-[#111318] flex items-center gap-2">
              <Globe className="w-3 h-3 text-[#8291EA]" />
              <span>Web Browsers</span>
            </div>
            <div className="p-2 border border-white/10 bg-[#111318] flex items-center gap-2">
              <Smartphone className="w-3 h-3 text-[#8291EA]" />
              <span>Mobile Apps</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[10px] font-mono text-white/50">
          <span>CROSS-SURFACE</span>
          <span className="text-[#8291EA]">RUNNER</span>
        </div>
      </div>

      <div className="col-span-7 bg-[#F5F5F2] text-[#111318] p-3 sm:p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#111318]/10 pb-2">
          <div className="flex items-center gap-2">
            <Workflow className="w-3.5 h-3.5 text-[#8291EA]" strokeWidth={1.75} />
            <span className="text-xs font-semibold">Automation Studio</span>
          </div>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[#111318] text-white">
            IN DEVELOPMENT
          </span>
        </div>

        <div className="my-2 space-y-2 text-[10px] sm:text-[11px]">
          <div className="p-2 bg-white border border-[#111318]/12 flex items-center justify-between">
            <span>[Trigger] → Capture Desktop UI</span>
            <span className="font-mono text-[#777777]">STEP 01</span>
          </div>
          <div className="p-2 bg-white border border-[#8291EA] flex items-center justify-between">
            <span>[Action] → Sync Browser & Mobile</span>
            <span className="font-mono text-[#8291EA]">STEP 02</span>
          </div>
        </div>

        <div className="border-t border-[#111318]/10 pt-2 flex items-center justify-between text-[10px] font-mono text-[#777777]">
          <span>WORKFLOW ENGINE</span>
          <span className="text-[#111318]">ARCHITECTURE</span>
        </div>
      </div>
    </div>
  );
}
