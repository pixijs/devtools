import { useState } from 'react';
import { ChromePicker, ChromePickerProps } from 'react-color';
import { Button } from '../ui/button';

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
        <div className="inline-flex h-6 w-full items-center justify-center rounded">
          <div style={{ position: 'absolute', zIndex: '2' }}>
            <div
              style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }}
              onClick={handleClose}
            />
            <ChromePicker
              color={hex}
              onChange={(updatedColor) => onChange(JSON.stringify(updatedColor.hex))}
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
