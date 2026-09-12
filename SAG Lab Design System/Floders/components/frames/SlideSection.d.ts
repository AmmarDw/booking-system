export interface SlideSectionProps {
  /** Curriculum number, Latin digits, set at 200px, e.g. "7.10". */
  number?: string | number;
  /** Section title, Arabic, 76px. */
  title: string;
  /** One optional supporting line. */
  subtitle?: string;
  /** Default "dark". */
  surface?: "light" | "dark";
  day?: string;
  slideNumber?: number | string;
}
export declare function SlideSection(props: SlideSectionProps): JSX.Element;
