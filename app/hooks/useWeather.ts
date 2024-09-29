import { useEffect } from 'react';
import { Location } from '@/types/location';

export default (props: Location) => {
  const { location, datetime } = props;

  useEffect(() => {
    let isFetch = true;

    if (isFetch) {
      (async () => {
        try {

        } catch { }
      })();
    }

    return () => {
      isFetch = false;
    }
  }, [location, datetime]);

  return {

  }
};