export interface SkillCardProps {
  /** One line of Arabic. Keep it to a single clause. */
  text: string;
  /** Lucide icon name for the slot. Default "check". */
  icon?: string;
  /** Custom node for the icon slot; overrides icon. */
  iconNode?: React.ReactNode;
  /** "done" adds a teal state edge. */
  state?: "default" | "done";
  className?: string;
  style?: React.CSSProperties;
}
export declare function SkillCard(props: SkillCardProps): JSX.Element;
