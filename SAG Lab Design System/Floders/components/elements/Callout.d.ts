export interface CalloutProps {
  /** info = sky, warning = amber, rule = teal. Default "info". */
  tone?: "info" | "warning" | "rule";
  /** Heading. Defaults per tone: ملاحظة / تنبيه / قاعدة. Pass null to hide. */
  label?: string | null;
  /** Body copy, Arabic. */
  children?: React.ReactNode;
  /** Override the Lucide glyph. */
  icon?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Callout(props: CalloutProps): JSX.Element;
