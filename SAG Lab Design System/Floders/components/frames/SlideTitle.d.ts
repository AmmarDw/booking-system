import { PresenterBlockProps } from "../elements/PresenterBlock";
export interface SlideTitleProps {
  /** Program name — the display line, 68px. */
  program?: string;
  /** One supporting line beneath it. */
  subtitle?: string;
  /** Presenter block props; omit to hide. */
  presenter?: PresenterBlockProps;
  /** Default "dark" — the cover is a dark surface. */
  surface?: "light" | "dark";
  day?: string;
  slideNumber?: number | string;
  /** Override the wordmark lines. */
  wordmarkLines?: string[];
}
export declare function SlideTitle(props: SlideTitleProps): JSX.Element;
