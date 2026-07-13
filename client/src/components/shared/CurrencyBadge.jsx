import React, { useContext } from 'react';
import { PrivacyContext } from '../../context/PrivacyContext';
import useFormatINR from '../../hooks/useFormatINR';

const CurrencyBadge = ({ amount, compact = false, style = {} }) => {
  const { isPrivacyMode } = useContext(PrivacyContext);
  const { formatINR: fmt, formatCompact } = useFormatINR();

  const displayValue = isPrivacyMode
    ? '₹ ***'
    : compact
      ? formatCompact(amount)
      : fmt(amount);

  return (
    <span
      className="font-number"
      style={{
        fontWeight: 600,
        ...style,
      }}
    >
      {displayValue}
    </span>
  );
};

export default CurrencyBadge;
