import React from 'react';
import CountUpModule from 'react-countup';

const CountUp = CountUpModule.default || CountUpModule;

const CountUpWrapper = (props) => {
  return <CountUp {...props} />;
};

export default CountUpWrapper;
