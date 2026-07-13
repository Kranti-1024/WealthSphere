import React, { useContext } from 'react';
import { PrivacyContext } from '../context/PrivacyContext';
import { formatINR } from '../utils/formatters';

const MaskedAmount = ({ amount, compact = false, className = '' }) => {
  const { isPrivacyMode } = useContext(PrivacyContext);

  if (isPrivacyMode) {
    return <span className={className}>••••••</span>;
  }

  return <span className={className}>{formatINR(amount, compact)}</span>;
};

export default MaskedAmount;
