import { cn } from '../../lib/utils';
import type { InputProps } from '../ui/input';
import { Input } from '../ui/input';

export interface Vector2Props {
  x: InputProps & { label: string };
  y: InputProps & { label: string };
  className?: string;
  onChange: (val: string) => void;
  value: [number, number] | null;
}
export const Vector2: React.FC<Vector2Props> = ({ x, y, className, onChange, value }) => {
  value = value || ([] as unknown as [number, number]);
  x.onChange = (event) => {
    const val = Number(event.target.value);
    onChange(JSON.stringify([val, value[1]]));
  };
  y.onChange = (event) => {
    const val = Number(event.target.value);
    onChange(JSON.stringify([value[0], val]));
  };

  x.value = value[0];
  y.value = value[1];

  return (
    <div className={cn('flex gap-2 text-xs', className)}>
      <div className="flex items-center gap-2">
        <div>{x.label}</div>
        <Input
          {...x}
          type="number"
          className="border-border hover:border-secondary focus:border-secondary h-6 w-full rounded text-xs outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <div>{y.label}</div>
        <Input
          {...y}
          type="number"
          className="border-border hover:border-secondary focus:border-secondary h-6 w-full rounded text-xs outline-none"
        />
      </div>
    </div>
  );
};

export interface VectorXProps {
  inputs: (InputProps & { label: string })[];
  onChange: (value: string) => void;
  value: number[] | null;
}
export const VectorX: React.FC<VectorXProps> = ({ inputs, onChange, value }) => {
  value = value || [];
  inputs.forEach((vector, index) => {
    vector.onChange = (e) => {
      const newValue = [...value];
      newValue[index] = Number(e.target.value);
      onChange(JSON.stringify(newValue));
    };

    vector.value = value[index];
  });

  return (
    <div className={cn('flex flex-wrap gap-2 text-xs')}>
      {inputs.map((input, index) => (
        <div key={index} className="flex items-center gap-2">
          <div>{input.label}</div>
          <Input
            {...input}
            type="number"
            className="border-border hover:border-secondary focus:border-secondary h-6 w-full max-w-24 rounded text-xs outline-none"
          />
        </div>
      ))}
    </div>
  );
};
