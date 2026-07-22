export interface BadgeProps {
  tone?: 'success' | 'warning' | 'danger' | 'neutral' | 'primary';
  dot?: boolean;
  children: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
