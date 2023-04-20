import React from 'react';
import Styles from '../styles/HomePage.module.css';

function HomePage({ callback }) {
  return (
    <div id={Styles.container} className='HomePage'>
      <h1 id={Styles.MainHeader}>ChatGPT Clone</h1>
      <div id={Styles.centerDiv}>
        <div>
          <h2 className={Styles.SubHeader}>
            <svg
              stroke='currentColor'
              fill='none'
              stroke-width='1.5'
              viewBox='0 0 24 24'
              stroke-linecap='round'
              stroke-linejoin='round'
              height='1.3em'
              width='1.3em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='12' cy='12' r='5'></circle>
              <line x1='12' y1='1' x2='12' y2='3'></line>
              <line x1='12' y1='21' x2='12' y2='23'></line>
              <line x1='4.22' y1='4.22' x2='5.64' y2='5.64'></line>
              <line x1='18.36' y1='18.36' x2='19.78' y2='19.78'></line>
              <line x1='1' y1='12' x2='3' y2='12'></line>
              <line x1='21' y1='12' x2='23' y2='12'></line>
              <line x1='4.22' y1='19.78' x2='5.64' y2='18.36'></line>
              <line x1='18.36' y1='5.64' x2='19.78' y2='4.22'></line>
            </svg>
            Examples
          </h2>
          <ul className={Styles.tileList}>
            <button
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                let text = e.target.textContent;
                let extractedText = text
                  .match(/"([^"]+)"/)[0]
                  .replace(/"/g, '');
                callback(extractedText);
              }}
              className={Styles.descTile}
            >
              "Explain quantum computing in simple terms" →
            </button>
            <button
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                let text = e.target.textContent;
                let extractedText = text
                  .match(/"([^"]+)"/)[0]
                  .replace(/"/g, '');
                callback(extractedText);
              }}
              className={Styles.descTile}
            >
              "Got any creative ideas for a 10 year old’s birthday?" →
            </button>
            <button
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                let text = e.target.textContent;
                let extractedText = text
                  .match(/"([^"]+)"/)[0]
                  .replace(/"/g, '');
                callback(extractedText);
              }}
              className={Styles.descTile}
            >
              "How do I make an HTTP request in Javascript?" →
            </button>
          </ul>
        </div>
        <div>
          <h2 className={Styles.SubHeader}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              aria-hidden='true'
              height='1.3em'
              width='1.3em'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z'
              ></path>
            </svg>
            Capabilities
          </h2>
          <ul className={Styles.tileList}>
            <div className={Styles.descTile}>
              Remembers what user said earlier in the conversation
            </div>
            <div className={Styles.descTile}>
              Allows user to provide follow-up corrections
            </div>
            <div className={Styles.descTile}>
              Trained to decline inappropriate requests
            </div>
          </ul>
        </div>
        <div>
          <h2 className={Styles.SubHeader}>
            <svg
              stroke='currentColor'
              fill='none'
              stroke-width='1.5'
              viewBox='0 0 24 24'
              stroke-linecap='round'
              stroke-linejoin='round'
              height='1.3em'
              width='1.3em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path>
              <line x1='12' y1='9' x2='12' y2='13'></line>
              <line x1='12' y1='17' x2='12.01' y2='17'></line>
            </svg>
            Limitations
          </h2>
          <ul className={Styles.tileList}>
            <div className={Styles.descTile}>
              May occasionally generate incorrect information
            </div>
            <div className={Styles.descTile}>
              May occasionally produce harmful instructions or biased content
            </div>
            <div className={Styles.descTile}>
              Limited knowledge of world and events after 2021
            </div>
          </ul>
        </div>
      </div>
      <div id={Styles.bottomDiv}></div>
    </div>
  );
}

export default HomePage;
