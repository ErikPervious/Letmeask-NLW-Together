import { useState } from 'react';

export function Button() {
  const [value, setValue] = useState(0);

  function changeValue() {
    setValue(value + 1);
  }

  return (
    <button onClick={changeValue}>{value}</button>
  )
}