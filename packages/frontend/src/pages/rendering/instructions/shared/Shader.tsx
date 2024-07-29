import { useTheme } from '../../../../components/theme-provider';
import React, { memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ShaderProps {
  vertex: string;
  fragment: string;
}
export const Shader: React.FC<ShaderProps> = memo(({ vertex, fragment }) => {
  return (
    <div className={`flex flex-col items-center justify-between`}>
      <ShaderView value={fragment} />
      <ShaderView value={vertex} />
    </div>
  );
});

export const ShaderView: React.FC<{ value: string }> = memo(({ value }) => {
  const valueFix = formatShader(value);
  const { theme } = useTheme();
  const style = theme === 'dark' ? dracula : prism;
  return (
    <SyntaxHighlighter language="javascript" style={style} customStyle={{ width: '100%' }}>
      {valueFix}
    </SyntaxHighlighter>
  );
});

/**
 * formats a shader so its more pleasant to read!
 * @param shader - a glsl shader program source
 */
function formatShader(shader: string): string {
  const spl = shader
    .split(/([\n{}])/g)
    .map((a) => a.trim())
    .filter((a) => a.length);

  let indent = '';

  const formatted = spl
    .map((a) => {
      let indentedLine = indent + a;

      if (a === '{') {
        indent += '    ';
      } else if (a === '}') {
        indent = indent.substr(0, indent.length - 4);

        indentedLine = indent + a;
      }

      return indentedLine;
    })
    .join('\n');

  return formatted;
}
