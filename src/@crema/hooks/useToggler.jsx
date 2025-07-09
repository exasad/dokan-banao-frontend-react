import { useState } from 'react';

export const useToggler = (initialState) => {
  const [value, setValue] = useState(initialState);

  const toggleValue = () => setValue((prev) => !prev);

  return [value, toggleValue];
};
