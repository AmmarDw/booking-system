export interface ButtonProps {
  /** Visual style */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Optional leading icon element */
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}
export declare function Button(props: ButtonProps): JSX.Element;
