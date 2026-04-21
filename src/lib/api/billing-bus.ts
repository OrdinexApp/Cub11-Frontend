type Listener = (detail: { message?: string }) => void;

const listeners = new Set<Listener>();

export const billingBus = {
  emitOutOfCredits(detail: { message?: string } = {}) {
    listeners.forEach((l) => l(detail));
  },
  onOutOfCredits(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
