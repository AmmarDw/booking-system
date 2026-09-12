import { SectionBadgeProps } from "../elements/SectionBadge";
export interface SlideContentProps {
  /** The one heading on the slide. */
  title: string;
  /** Optional lead line, 29px. */
  lead?: string;
  /** Up to 7 bullets. More than 7 means two slides. */
  bullets?: React.ReactNode[];
  /** 0-based bullet to highlight — sky tint plus a teal inline-start edge. Other bullets stay full-opacity ink. */
  focusIndex?: number;
  /** Curriculum badge props — every content slide should carry one. */
  badge?: SectionBadgeProps;
  /** Extra content below the bullets (a Callout, an AgendaRow stack). */
  children?: React.ReactNode;
  surface?: "light" | "dark";
  day?: string;
  slideNumber?: number | string;
  progress?: React.ReactNode;
}
export declare function SlideContent(props: SlideContentProps): JSX.Element;
