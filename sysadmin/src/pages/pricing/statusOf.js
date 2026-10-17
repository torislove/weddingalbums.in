/** 3-state CMS-first status badge: string + colour class. */
export const statusOf = (state) =>
  state === 'fills'
    ? { cls: 'text-green-400', text: '✓ Fills an unpriced item — drives the live price' }
    : state === 'cms-wins'
      ? { cls: 'text-amber-400', text: '⚠ CMS Studio price wins — this row is ignored' }
      : { cls: 'text-gray-500', text: '— No CMS match — not shown in the estimator' };
