export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
}
export declare function Modal(props: ModalProps): JSX.Element | null;
