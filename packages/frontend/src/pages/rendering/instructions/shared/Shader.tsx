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
    <>
      <ShaderView value={fragment} title="Fragment" />
      <ShaderView value={vertex} title="Vertex" />
    </>
  );
});

export const ShaderView: React.FC<{ value: string; title: string }> = memo(({ value, title }) => {
  const valueFix = formatShader(value);
  const { theme } = useTheme();
  const style = theme === 'dark' ? dracula : prism;
  return (
    <div className="flex h-full items-center pt-1">
      <div className="w-1/4 overflow-hidden break-keep pr-2 text-xs">{title}</div>
      <div className="flex w-full max-w-[80%] items-center pl-2">
        <SyntaxHighlighter language="javascript" style={style} customStyle={{ width: '100%' }}>
          {valueFix}
        </SyntaxHighlighter>
      </div>
    </div>
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
