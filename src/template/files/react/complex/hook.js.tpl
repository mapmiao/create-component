import { useState } from 'react';

export function {{hookName}}() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((c) => c + 1);
  };

  return { count, handleClick };
}