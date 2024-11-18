import { useStore } from '@/store/useStore';
import Toast from './Toast';

const ToastContainer = () => {
  const toasts = useStore((state) => state.toastList);

  return (
    <div
      id="toast-container"
      className="pointer-events-none fixed z-[9999] flex w-full flex-col items-center justify-end gap-2 p-4"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
