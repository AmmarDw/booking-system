export interface SlideQuoteProps {
  /** The single statement, 56px bold. Keep it under 30 characters per line. */
  text: React.ReactNode;
  /** Source or reframing line beneath. */
  attribution?: string;
  /** Colour of the rule above: default (sky) / warning (amber) / rule (teal). */
  tone?: "default" | "warning" | "rule";
  surface?: "light" | "dark";
  day?: string;
  slideNumber?: number | string;
}
export declare function SlideQuote(props: SlideQuoteProps): JSX.Element;
