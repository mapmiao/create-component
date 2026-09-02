import { useState } from 'react';

interface Use{{componentName}}Return {
  count: number;
  handleClick: () => void;
}

export function {{hookName}}(): Use{{componentName}}Return {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((c) => c + 1);
  };

  return { count, handleClick };
}