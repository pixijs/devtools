import { FaRegCopy as ClipboardIcon } from 'react-icons/fa6';
import { FaCheck as CheckIcon } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { Button } from './button';
import { copyToClipboard } from '@devtool/frontend/lib/utils';

export const CopyToClipboardButton: React.FC<{ data: string }> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const onClick = (data: string) => {
    copyToClipboard(data);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000); // Change back to ClipboardIcon after 2 seconds

      return () => clearTimeout(timer); // Clean up on unmount
    }
  }, [copied]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:border-primary absolute right-8 top-8 h-8 rounded"
      onClick={() => onClick(data)}
    >
      {copied ? <CheckIcon className="fill-primary" /> : <ClipboardIcon className="dark:fill-white" />}
    </Button>
  );
};
