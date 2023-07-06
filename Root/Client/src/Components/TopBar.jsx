import React from 'react';
import Styles from '../styles/TopBar.module.css';

function TopBar(props) {
  return (
    <div className={Styles.TopBar}>
      <div className={Styles.buttonDivLeft}>
        <button
          className={Styles.buttonLeft}
          onClick={() => {
            if (props.mobileSideBarActive) {
              props.setMobileSideBarActive(false);
            } else {
              props.setMobileSideBarActive(true);
            }
          }}
        >
          <svg
            stroke='currentColor'
            fill='none'
            stroke-width='1.5'
            viewBox='0 0 24 24'
            stroke-linecap='round'
            stroke-linejoin='round'
            class='h-6 w-6'
            height='1.7em'
            width='1.7em'
            xmlns='http://www.w3.org/2000/svg'
          >
            <line x1='3' y1='12' x2='21' y2='12'></line>
            <line x1='3' y1='6' x2='21' y2='6'></line>
            <line x1='3' y1='18' x2='21' y2='18'></line>
          </svg>
        </button>
      </div>
      <p>
        {props.convIndexRef.current
          ? props.conversations[props.convIndexRef.current].name
          : ''}
      </p>
      <div className={Styles.buttonDivRight}>
        <button
          onClick={() => {
            props.setMessage('');
            props.newConversation();
          }}
          className={Styles.buttonRight}
        >
          <svg
            stroke='currentColor'
            fill='none'
            stroke-width='1.5'
            viewBox='0 0 24 24'
            stroke-linecap='round'
            stroke-linejoin='round'
            class='h-6 w-6'
            height='1.7em'
            width='1.7em'
            xmlns='http://www.w3.org/2000/svg'
          >
            <line x1='12' y1='5' x2='12' y2='19'></line>
            <line x1='5' y1='12' x2='19' y2='12'></line>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TopBar;
