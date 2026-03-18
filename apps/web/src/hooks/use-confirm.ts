import { useState, useCallback } from "react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    isLoading: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        isOpen: true,
        isLoading: false,
        onConfirm: () => {
          setState((s) => ({ ...s, isLoading: true }));
          resolve(true);
          setState((s) => ({ ...s, isOpen: false, isLoading: false }));
        },
        onCancel: () => {
          resolve(false);
          setState((s) => ({ ...s, isOpen: false }));
        },
      });
    });
  }, []);

  return { confirm, dialogProps: state };
}
