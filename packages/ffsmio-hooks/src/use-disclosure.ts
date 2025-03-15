import {
  ForwardedRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

export interface Disclosure {
  open(): void;
  close(): void;
}

export interface UseDisclosureProps {
  open?: boolean;
  onOpen?(): void;
  onClose?(): void;
  onBeforeClose?(): void;
  onBeforeCloseAsync?(): Promise<void>;
  onBeforeOpen?(): void;
  onBeforeOpenAsync?(): Promise<void>;
}

export function useDisclosure(
  props: UseDisclosureProps = {},
  ref?: ForwardedRef<Disclosure | null>
) {
  const {
    open = false,
    onOpen,
    onClose,
    onBeforeOpen,
    onBeforeOpenAsync,
    onBeforeClose,
    onBeforeCloseAsync,
  } = props;

  const [isOpen, setIsOpen] = useState(open);

  const handleOpen = useCallback(async () => {
    onBeforeOpen?.();
    await onBeforeOpenAsync?.();
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const handleClose = useCallback(async () => {
    onBeforeClose?.();
    await onBeforeCloseAsync?.();
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  useImperativeHandle(
    ref,
    () => ({
      open: handleOpen,
      close: handleClose,
    }),
    [handleOpen, handleClose]
  );

  useEffect(() => {
    open ? handleOpen() : handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleOpenChange = useCallback(
    (open: boolean) => (open ? handleOpen() : handleClose()),
    [handleOpen, handleClose]
  );

  return [isOpen, handleOpenChange] as const;
}
