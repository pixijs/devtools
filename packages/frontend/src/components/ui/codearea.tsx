import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const CodeArea: React.FC<{ codeString: string }> = ({ codeString }) => {
  return (
    <div className="rounded bg-gray-800">
      <SyntaxHighlighter language="javascript" style={dracula} wrapLines={true} wrapLongLines={true}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
