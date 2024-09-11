import type { CursorProps } from 'react-arborist';

export function Cursor({ top, left, indent }: CursorProps) {
  return (
    <div className="pointer-events-none absolute flex items-center" style={{ top: top - 2, left, right: indent }}>
      <div className="absolute h-1 w-full border-t-2 border-dotted"></div>
    </div>
  );
}
