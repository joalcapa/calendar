import { useState } from 'react';

export default () => {
  const [isLoading, setLoading] = useState(false);

  const fetch = () => {

  }

  return {
    isLoading,
    fetch,
  }
};