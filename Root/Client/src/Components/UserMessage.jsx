import React from 'react';
import ReactMarkdown from 'react-markdown';
import Styles from '../styles/Message.module.css';

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
            <ReactMarkdown>{children.replace(/\n$/, '\n\n')}</ReactMarkdown>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default UserMessage;
