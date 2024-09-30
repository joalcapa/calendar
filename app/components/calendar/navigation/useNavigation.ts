'use client'

import { useEffect, useState } from 'react';

export default () => {
  const [ isMount, setMount ] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return {
    isMount,
  }
};