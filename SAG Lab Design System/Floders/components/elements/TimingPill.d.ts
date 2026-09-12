export interface TimingPillProps {
  /** Duration in Arabic-Indic numerals, e.g. "٢٥ دقيقة". */
  label: string;
  /** "default" (snow) or "accent" (sky tint). */
  tone?: "default" | "accent";
  /** Lucide icon name, or null for no glyph. Default "clock". */
  icon?: string | null;
  className?: string;
  style?: React.CSSProperties;
}
export declare function TimingPill(props: TimingPillProps): JSX.Element;
