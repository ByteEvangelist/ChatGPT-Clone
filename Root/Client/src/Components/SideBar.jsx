import React from 'react';
import Styles from '../styles/SideBar.module.css';

function SideBar(props) {
  return (
    <>
      <div className={props.mobileMode ? Styles.mobileSideBar : Styles.sidebar}>
        <button
          id={Styles.newchat}
          onClick={() => {
            props.setMessage('');
            props.newConversation();
          }}
        >
          <svg
            stroke='currentColor'
            fill='none'
            stroke-width='2'
            viewBox='0 0 24 24'
            stroke-linecap='round'
            stroke-linejoin='round'
            height='16px'
            width='16px'
            xmlns='http://www.w3.org/2000/svg'
          >
            <line x1='12' y1='5' x2='12' y2='19'></line>
            <line x1='5' y1='12' x2='19' y2='12'></line>
          </svg>
          New chat
        </button>
        <div id={Styles.conversationsList}>
          {props.reversedConvs.map((conv, index) =>
            props.conversations.length - index - 1 == props.convIndex ? (
              <button
                key={index}
                className={Styles.conversationButton}
                style={{ backgroundColor: 'rgb(52, 53, 65)' }}
              >
                <svg
                  stroke='currentColor'
                  fill='none'
                  stroke-width='2'
                  viewBox='0 0 24 24'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  height='1.15em'
                  width='1.15em'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
                </svg>
                <div></div>
                {props.conversations.length - index - 1 == props.editId ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      props.setConversations((convs) => {
                        let newConversations = [...convs];
                        newConversations[props.editId].name = props.editText;
                        return newConversations;
                      });
                      props.setEditId(-1);
                      props.setEditText('');
                    }}
                  >
                    <input
                      autoFocus={true}
                      className={Styles.editNameInput}
                      onChange={(e) => {
                        props.setEditText(e.target.value);
                      }}
                      value={props.editText}
                    ></input>
                  </form>
                ) : (
                  <p>{conv.name}</p>
                )}
                <div></div>

                {props.conversations.length - index - 1 == props.editId ? (
                  <div className={Styles.convoButtons}>
                    <button
                      className={Styles.editConvoName}
                      onClick={() => {
                        props.setEditId(props.conversations.length - index - 1);
                        props.setEditText(conv.name);
                      }}
                    >
                      <svg
                        stroke='currentColor'
                        fill='none'
                        stroke-width='2'
                        viewBox='0 0 24 24'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        height='1.2em'
                        width='1.2em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M12 20h9'></path>
                        <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'></path>
                      </svg>
                    </button>
                    <button className={Styles.deleteConvo}>
                      <svg
                        stroke='currentColor'
                        fill='none'
                        stroke-width='2'
                        viewBox='0 0 24 24'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        height='1.2em'
                        width='1.2em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <polyline points='3 6 5 6 21 6'></polyline>
                        <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
                        <line x1='10' y1='11' x2='10' y2='17'></line>
                        <line x1='14' y1='11' x2='14' y2='17'></line>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className={Styles.convoButtons}>
                    <button
                      className={Styles.editConvoName}
                      onClick={() => {
                        props.setEditId(props.conversations.length - index - 1);
                        props.setEditText(conv.name);
                      }}
                    >
                      <svg
                        stroke='currentColor'
                        fill='none'
                        stroke-width='2'
                        viewBox='0 0 24 24'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        height='1.2em'
                        width='1.2em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M12 20h9'></path>
                        <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (props.postMessagesController.current) {
                          props.postMessagesController.current.abort();
                        }
                        props.setConversations((convs) => {
                          let newConversations = [...convs];
                          newConversations.splice(
                            props.conversations.length - index - 1,
                            1
                          );
                          if (props.conversations.length - 1 < 1) {
                            props.newConversation();
                          } else {
                            if (props.convIndexRef.current == 0) {
                              props.setCurrentConversation(
                                props.convIndexRef.current + 1,
                                convs
                              );
                            }
                            props.setCurrentConversation(
                              props.convIndexRef.current - 1,
                              convs
                            );
                          }
                          return newConversations;
                        });
                      }}
                      className={Styles.deleteConvo}
                    >
                      <svg
                        stroke='currentColor'
                        fill='none'
                        stroke-width='2'
                        viewBox='0 0 24 24'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        height='1.2em'
                        width='1.2em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <polyline points='3 6 5 6 21 6'></polyline>
                        <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
                        <line x1='10' y1='11' x2='10' y2='17'></line>
                        <line x1='14' y1='11' x2='14' y2='17'></line>
                      </svg>
                    </button>
                  </div>
                )}
              </button>
            ) : (
              <button
                key={index}
                className={Styles.conversationButton}
                onClick={() => {
                  props.setCurrentConversation(
                    props.conversations.length - index - 1,
                    props.conversations
                  );
                }}
              >
                <svg
                  stroke='currentColor'
                  fill='none'
                  stroke-width='2'
                  viewBox='0 0 24 24'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  height='1.15em'
                  width='1.15em'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
                </svg>
                <div></div>
                <p>{conv.name}</p>
              </button>
            )
          )}
        </div>
        <div className={Styles.sidebarOptions}>
          <button
            id={Styles.github}
            onClick={() => {
              window
                .open('https://github.com/ByteEvangelist/ChatGPT-Clone')
                .focus();
            }}
          >
            <svg
              viewBox='0 0 192 192'
              xml:space='preserve'
              stroke='white'
              fill='none'
              stroke-width='12'
              stroke-linecap='round'
              stroke-linejoin='round'
              height='1.6em'
              width='1.6em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M120.755 170c.03-4.669.059-20.874.059-27.29 0-9.272-3.167-15.339-6.719-18.41 22.051-2.464 45.201-10.863 45.201-49.067 0-10.855-3.824-19.735-10.175-26.683 1.017-2.516 4.413-12.63-.987-26.32 0 0-8.296-2.672-27.202 10.204-7.912-2.213-16.371-3.308-24.784-3.352-8.414.044-16.872 1.14-24.785 3.352C52.457 19.558 44.162 22.23 44.162 22.23c-5.4 13.69-2.004 23.804-.987 26.32C36.824 55.498 33 64.378 33 75.233c0 38.204 23.149 46.603 45.2 49.067-3.551 3.071-6.719 9.138-6.719 18.41 0 6.416.03 22.621.059 27.29M27 130c9.939.703 15.67 9.735 15.67 9.735 8.834 15.199 23.178 10.803 28.815 8.265' />
            </svg>
            GitHub Repo
          </button>
          <button
            id={Styles.clearConversations}
            onClick={() => {
              props.setConversations([]);
              props.newConversation();
            }}
          >
            <svg
              stroke='currentColor'
              fill='none'
              stroke-width='2'
              viewBox='0 0 24 24'
              stroke-linecap='round'
              stroke-linejoin='round'
              height='1.3em'
              width='1.3em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <polyline points='3 6 5 6 21 6'></polyline>
              <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
              <line x1='10' y1='11' x2='10' y2='17'></line>
              <line x1='14' y1='11' x2='14' y2='17'></line>
            </svg>
            Clear Conversations
          </button>
          <div></div>
        </div>
      </div>
      {props.mobileMode ? (
        <div
          onClick={() => {
            props.setMobileSideBarActive(false);
          }}
          className={Styles.mobileOverlay}
        ></div>
      ) : (
        <></>
      )}
    </>
  );
}

export default SideBar;
