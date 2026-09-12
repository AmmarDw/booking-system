import { SectionBadgeProps } from "../elements/SectionBadge";
export interface SlideStep {
  /** Step heading, Arabic. */
  title: string;
  /** One supporting line. */
  note?: React.ReactNode;
  /** Optional 200x112 thumbnail URL. */
  thumb?: string;
  /** Force the chip state instead of deriving it from activeIndex. */
  state?: "upcoming" | "active" | "done";
}
export interface SlideStepsProps {
  title: string;
  badge?: SectionBadgeProps;
  /** 3–6 steps. Six is the hard ceiling at this type size. */
  steps?: SlideStep[];
  /** 0-based active step; earlier steps render as done. */
  activeIndex?: number;
  surface?: "light" | "dark";
  day?: string;
  slideNumber?: number | string;
}
export declare function SlideSteps(props: SlideStepsProps): JSX.Element;
