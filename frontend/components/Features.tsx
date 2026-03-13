import SectionHeader from "./SectionHeader";

interface FeatureCardProps {
  iconColor: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  bgColor?: string;
  borderColor?: string;
}

function FeatureCard({
  iconColor,
  title,
  description,
  tag,
  tagColor,
  bgColor = "#111111",
  borderColor = "#2D2D2D",
}: FeatureCardProps) {
  return (
    <div
      className="flex flex-col gap-5 p-8 md:p-[32px] border w-full md:flex-1 md:h-[320px] transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[rgba(139,251,37,0.05)] cursor-pointer"
      style={{ backgroundColor: bgColor, borderColor }}
    >
      <div className="w-[40px] h-[40px] shrink-0" style={{ backgroundColor: iconColor }} />
      <h3 className="font-grotesk text-[18px] font-bold text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line">
        {title}
      </h3>
      <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
        {description}
      </p>
      <div
        className="flex items-center justify-center h-[28px] px-[12px] bg-[#1A1A1A] border w-fit mt-auto"
        style={{ borderColor: tagColor }}
      >
        <span className="font-ibm-mono text-[11px] tracking-[2px]" style={{ color: tagColor }}>
          {tag}
        </span>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section
      id="features"
      className="flex flex-col w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]"
    >
      <SectionHeader
        label="[01] // MODULES"
        title={"THREE THREAT VECTORS.\nONE PLATFORM."}
        subtitle="ENGINEERED TO DETECT. BUILT TO PROTECT. DRIVEN BY AI."
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        <FeatureCard
          iconColor="#8bfb25"
          title={"URL PHISHING\nSCANNER"}
          description="ML-POWERED ANALYSIS OF 20+ URL FEATURES IN REAL-TIME TO DETECT IMPERSONATION AND MALICIOUS REDIRECTS."
          tag="SCAN URL"
          tagColor="#8bfb25"
          borderColor="#8bfb25"
          bgColor="#0A0A0A"
        />
        <FeatureCard
          iconColor="#FFD600"
          title={"FAKE NEWS\nDETECTOR"}
          description="SENSATIONALIST LANGUAGE AND CREDIBILITY SCORING USING NLP PIPELINES AND GEMINI AI MODELS."
          tag="ANALYZE TEXT"
          tagColor="#FFD600"
          bgColor="#0F0F0F"
          borderColor="#FFD600"
        />
        <FeatureCard
          iconColor="#FF3366"
          title={"DEEPFAKE\nANALYZER"}
          description="HEURISTIC ARTIFACT SCANNING COMBINED WITH COMPUTER VISION TO VERIFY THE AUTHENTICITY OF UPLOADED MEDIA."
          tag="CHECK MEDIA"
          tagColor="#FF3366"
          borderColor="#FF3366"
          bgColor="#111111"
        />
      </div>
    </section>
  );
}
