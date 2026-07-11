import Image from "next/image";

export const FLAG_CODES: Record<string, string> = {
  "English":  "gb",
  "Spanish":  "es",
  "French":   "fr",
  "Japanese": "jp",
  "German":   "de",
  "Kannada":  "in",
  "Hindi":    "in",
};

interface Props {
  languageName: string;
  width?: number;
  height?: number;
  borderRadius?: number;
}

export default function FlagImage({ languageName, width = 32, height = 24, borderRadius = 4 }: Props) {
  const code = FLAG_CODES[languageName] ?? "un";
  return (
    <div style={{
      width, height, borderRadius, overflow: "hidden", flexShrink: 0,
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      border: "1px solid rgba(0,0,0,0.08)",
      display: "inline-block",
    }}>
      <Image
        src={`https://flagcdn.com/w80/${code}.png`}
        alt={languageName}
        width={width}
        height={height}
        style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }}
        unoptimized
      />
    </div>
  );
}
