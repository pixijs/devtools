import { useState } from 'react';
import type { ChromePickerProps } from 'react-color';
import { ChromePicker } from 'react-color';
import { Button } from './button';

export interface ColorProps extends Omit<ChromePickerProps, 'onChange'> {
  value: number;
  onChange: (color: string) => void;
}

export const ColorInput: React.FC<ColorProps> = ({ value, onChange, ...rest }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  // convert number ot hex
  const hexString = value.toString(16);

  const hex = `#${'000000'.substring(0, 6 - hexString.length) + hexString}`;

  return (
    <div className="w-full">
      {displayColorPicker ? (
        <div className="flex flex-col items-center">
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:border-secondary focus:border-secondary h-6 w-full rounded outline-none"
            onClick={handleClose}
          >
            {hex}
          </Button>
          <div style={{ zIndex: '2' }}>
            <ChromePicker
              color={hex}
              onChange={(updatedColor) => onChange(JSON.stringify(updatedColor.hex))}
              className="relative top-2"
              {...rest}
            />
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="border-border hover:border-secondary focus:border-secondary h-6 w-full rounded outline-none"
          onClick={handleClick}
        >
          {hex}
        </Button>
        // <button className="w-full inline-flex align-middle justify-center h-6 rounded text-popover-foreground" onClick={handleClick}>{hex}</button>
      )}
    </div>
  );
};
