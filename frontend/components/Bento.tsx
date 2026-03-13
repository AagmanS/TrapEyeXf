import SectionHeader from "./SectionHeader";

export default function Bento() {
  return (
    <section className="flex flex-col w-full bg-[#0D0D0D] py-16 px-6 md:py-[100px] md:px-[120px] gap-10 md:gap-[48px]">
      <SectionHeader
        label="[02] // THREAT INTELLIGENCE"
        title={"THE HIGHEST QUALITY ANALYTICS.\nIN ONE PLATFORM."}
        titleWidth="w-full max-w-[800px]"
      />

      <div className="flex flex-col w-full gap-[2px]">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row w-full gap-[2px]">
          {/* Bento A — Green Dashboard stats */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[320px] bg-[#8bfb25] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-bold text-[#1A1A1A] tracking-[2px]">[ METRICS ]</span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-bold text-[#0A0A0A] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"DETECTED\nTHREATS: 12.4K"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#1A1A1A] tracking-[1px] leading-[1.6]">
              REAL-TIME PHISHING SCAMS BLOCKED IN THE LAST 30 DAYS ACROSS ALL VECTORS.
            </p>
            <div className="flex items-center justify-center h-[28px] px-[12px] bg-[#0A0A0A] w-fit">
              <span className="font-ibm-mono text-[10px] font-bold text-[#8bfb25] tracking-[2px]">[LIVE]</span>
            </div>
          </div>

          {/* Bento B - Threat Logs */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[320px] bg-[#111111] border border-[#2D2D2D] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px]">[ ALERTS ]</span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"SUSPICIOUS\nNEWS TRENDS"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
              MISINFORMATION DETECTED ACROSS FINANCIAL MARKETS OVER THE LAST WEEKEND.
            </p>
          </div>

          {/* Bento C - Deepfakes */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[320px] bg-[#0A0A0A] border border-[#2D2D2D] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-bold text-[#FF3366] tracking-[2px]">[ SCANNER ]</span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"DEEPFAKE\nANALYSIS: FAIL"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
              VIDEO #4991A EXCEEDS CONFIDENCE THRESHOLD OF 90% FOR AI MODIFICATION.
            </p>
            <div className="flex items-center justify-center h-[28px] px-[12px] bg-[#1A1A1A] border border-[#FF3366] w-fit">
              <span className="font-ibm-mono text-[10px] font-bold text-[#FF3366] tracking-[2px]">[CRITICAL]</span>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row w-full gap-[2px]">
          {/* Bento D */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[260px] bg-[#111111] border border-[#2D2D2D] w-full md:flex-1 transform transition-all hover:scale-[1.01] cursor-pointer">
            <span className="font-ibm-mono text-[11px] font-bold text-[#8bfb25] tracking-[2px]">[ SYSTEM ]</span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"GEMINI\nAI MODULE"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
              GOOGLE'S MULTIMODAL GEMINI PRO VISION BACKING ALL INTELLIGENCE ANALYSES.
            </p>
          </div>

          {/* Bento E */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[260px] bg-[#0F0F0F] border-2 border-[#FFD600] w-full md:flex-1">
            <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px]">[ AI PIPELINE ]</span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"MACHINE\nLEARNING NLP"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
              SKLEARN & XGBOOST MODEL EVALUATING URL FEATURES AT HIGH SPEED PRE-GEMINI CALL.
            </p>
            <div className="flex items-center justify-center h-[28px] px-[12px] bg-[#1A1A1A] border border-[#FFD600] w-fit">
              <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px]">[ACTIVE]</span>
            </div>
          </div>

          {/* Bento F */}
          <div className="flex flex-col gap-5 p-8 md:p-[40px] md:h-[260px] bg-[#0A0A0A] border border-[#2D2D2D] w-full md:flex-1 transform transition-all hover:scale-[1.01] cursor-pointer">
            <span className="font-ibm-mono text-[11px] font-bold text-[#8bfb25] tracking-[2px]">[ REPORT ]</span>
            <h3 className="font-grotesk text-[24px] md:text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-[1.1] whitespace-pre-line">
              {"ANALYTICS\nEXPORT"}
            </h3>
            <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
              MONTHLY CYBER VULNERABILITY REPORT AND SCAM DETECTION BREAKDOWNS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
