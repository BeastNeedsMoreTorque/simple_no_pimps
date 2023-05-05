import { useState, useEffect } from 'react';

const useFetch = (url, options) => {
  const [state, setState] = useState([null, false]);

  useEffect(() => {
    setState([null, true]);

    (async () => {
      const data = await fetch(url, options).then((res) => res.json());

      setState([data, false]);
    })();
  }, [url, options]);

  return state;
};

export default useFetch;
