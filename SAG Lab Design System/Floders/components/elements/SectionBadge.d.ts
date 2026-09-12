export interface SectionBadgeProps {
  /** Arabic label, e.g. "القسم" or "المهمة". Default "القسم". */
  kind?: string;
  /** Curriculum number, kept in Latin digits and LTR-isolated, e.g. "7.10". */
  number?: string | number;
  /** "solid" (sky tint) or "outline". Default "solid". */
  tone?: "solid" | "outline";
  className?: string;
  style?: React.CSSProperties;
}
export declare function SectionBadge(props: SectionBadgeProps): JSX.Element;
