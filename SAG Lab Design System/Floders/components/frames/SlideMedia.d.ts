import { MediaFrameProps } from "../elements/MediaFrame";
import { SectionBadgeProps } from "../elements/SectionBadge";
export interface SlideMediaProps {
  /** Short heading; often omitted so the media dominates further. */
  title?: string;
  /** The one instruction line beside the media, 29px. Keep it to ~15 words. */
  instruction?: string;
  /** Props forwarded to MediaFrame. */
  media?: MediaFrameProps;
  badge?: SectionBadgeProps;
  /** "stacked" (default) = full-width frame with the instruction beneath, the only layout that
   *  reaches the >=55% media budget. "side" puts the instruction beside the frame and drops the
   *  image to ~39% — use it only for a tall/portrait screenshot. */
  layout?: "stacked" | "side";
  surface?: "light" | "dark";
  day?: string;
  slideNumber?: number | string;
}
export declare function SlideMedia(props: SlideMediaProps): JSX.Element;
