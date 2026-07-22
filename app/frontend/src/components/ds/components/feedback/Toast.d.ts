export interface ToastProps {
  tone?: 'success' | 'warning' | 'danger' | 'primary';
  title: string;
  description?: string;
  onClose?: () => void;
}
export declare function Toast(props: ToastProps): JSX.Element;
