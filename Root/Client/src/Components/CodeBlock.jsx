import { useState } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import SyntaxHighlighterStyles from '../styles/SyntaxHighlighterStyles';
import Styles from '../styles/Message.module.css';

const CodeBlock = ({ children, language, ...props }) => {
  const [copied, setCopied] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const copyCode = (text) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setCopied(true);
    navigator.clipboard.writeText(text);
    setTimeoutId(
      setTimeout(() => {
        setCopied(false);
      }, 2000)
    );
  };

  return (
    <div className={Styles.CodeBlockContainer}>
      <div className={Styles.CodeBlockTop}>
        {language}
        {copied == false ? (
          <button
            onClick={() => {
              copyCode(children);
            }}
            className={Styles.CopyCode}
          >
            <svg
              stroke='currentColor'
              fill='none'
              stroke-width='2'
              viewBox='0 0 24 24'
              stroke-linecap='round'
              stroke-linejoin='round'
              class='h-4 w-4'
              height='1.2em'
              width='1.2em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'></path>
              <rect x='8' y='2' width='8' height='4' rx='1' ry='1'></rect>
            </svg>
            Copy code
          </button>
        ) : (
          <button className={Styles.CopyCode}>
            <svg
              stroke='currentColor'
              fill='none'
              stroke-width='2'
              viewBox='0 0 24 24'
              stroke-linecap='round'
              stroke-linejoin='round'
              class='h-4 w-4'
              height='1.2em'
              width='1.2em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <polyline points='20 6 9 17 4 12'></polyline>
            </svg>
            Copied!
          </button>
        )}
      </div>
      <SyntaxHighlighter
        style={SyntaxHighlighterStyles}
        language={language}
        showLineNumbers={false}
        wrapLines={true}
        wrapLongLines={true}
        PreTag='div'
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
