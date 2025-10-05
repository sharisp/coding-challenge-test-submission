import React, { FunctionComponent } from 'react';

import $ from './Radio.module.css';

interface RadioProps {
  id: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Radio: FunctionComponent<RadioProps> = ({ children, id, name, onChange, disabled }) => {
  return (
    <div className={$.radio}>
      <input type="radio" id={id} name={name} onChange={onChange} value={id} disabled={disabled} />
      <label htmlFor={id}>{children}</label>
    </div>
  );
};

export default Radio;
