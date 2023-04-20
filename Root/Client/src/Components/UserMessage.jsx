import React from 'react';
import ReactDom from 'react-dom';
import ReactMarkdown from 'react-markdown';
import Styles from '../styles/Message.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism/';

function UserMessage({ children }) {
  return (
    <div className='UserMessage'>
      <div className={Styles.userContainer}>
        <div className={Styles.sideSpace}></div>
        <div className={Styles.message}>
          <div className={Styles.pfpWrapper}>
            <div className={Styles.UserPfp}>PP</div>
          </div>
          <div>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
                      style={dark}
                      language={match[1]}
                      showLineNumbers={true}
                      wrapLines={true}
                      wrapLongLines={true}
                      PreTag='div'
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {children.replace(/\n$/, '\n\n')}
            </ReactMarkdown>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default UserMessage;
