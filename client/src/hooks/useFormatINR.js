import { useContext, useCallback } from 'react';
import { PrivacyContext } from '../context/PrivacyContext';
import { formatINR as rawFormatINR, formatINRCompact as rawFormatINRCompact } from '../utils/formatters';

/**
 * Custom hook that provides privacy-aware currency formatting.
 * When privacy mode is active, returns masked values.
 */
const useFormatINR = () => {
  const { isPrivacyMode } = useContext(PrivacyContext);

  const formatINR = useCallback(
    (amount) => {
      if (isPrivacyMode) return '₹ ***';
      return rawFormatINR(amount);
    },
    [isPrivacyMode]
  );

  const formatCompact = useCallback(
    (amount) => {
      if (isPrivacyMode) return '***';
      return rawFormatINRCompact(amount);
    },
    [isPrivacyMode]
  );

  return { formatINR, formatCompact };
};

export default useFormatINR;
