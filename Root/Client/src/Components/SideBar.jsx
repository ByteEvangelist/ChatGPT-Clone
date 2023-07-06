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
