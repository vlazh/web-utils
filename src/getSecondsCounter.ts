import toInt from '@js-toolkit/ts-utils/toInt';

export interface SecondsCounterOptions {
  onChange?: (data: { value: number; total: number }) => void;
}

export interface SecondsCounter {
  getTotal: () => number;
  push: (currentTime: number | { currentTime: number } | { data: { currentTime: number } }) => void;
  onChange: SecondsCounterOptions['onChange'];
  reset: VoidFunction;
  destroy: VoidFunction;
}

export default function getSecondsCounter({
  onChange,
}: SecondsCounterOptions = {}): SecondsCounter {
  const timestamps = new Set<number>();
  let listener = onChange;
  let destroyed = false;

  return {
    getTotal() {
      return timestamps.size;
    },
    push(time) {
      if (destroyed) throw new Error('SecondsCounter was destroyed.');
      const currentTime =
        // eslint-disable-next-line no-nested-ternary
        typeof time === 'number'
          ? time
          : 'currentTime' in time
          ? time.currentTime
          : time.data.currentTime;
      if (time == null) return;
      // Add new seconds to list
      const secs = toInt(currentTime);
      if (!timestamps.has(secs)) {
        timestamps.add(secs);
        listener && listener({ value: secs, total: timestamps.size });
      }
    },
    get onChange() {
      return listener;
    },
    set onChange(value: SecondsCounterOptions['onChange']) {
      listener = value;
    },
    reset() {
      timestamps.clear();
    },
    destroy() {
      destroyed = true;
      listener = undefined;
      this.reset();
    },
  };
}
