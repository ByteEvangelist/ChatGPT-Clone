import { useEffect, useState, useRef } from 'react';
import Styles from './styles/App.module.css';
import UserMessage from './Components/UserMessage';
import AssistantMessage from './Components/AssistantMessage';
import TextareaAutosize from 'react-textarea-autosize';
import HomePage from './Components/HomePage';
import Messages from './Components/Messages';

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [convIndex, setConvIndex] = useState(0);
  const convIndexRef = useRef(0);
  const [conversations, setConversations] = useState([]);
  const [reversedConvs, setReversedConvs] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [editText, setEditText] = useState('');
  const messagesOuterDiv = useRef(null);
  const [receivingMessage, setReceivingMessage] = useState(false);
  const postMessagesController = useRef(null);
  const getNameConvoController = useRef(null);

  const newConversation = () => {
    setConversations((convs) => {
      let newConvs = [
        ...convs,
        { name: 'New Chat ' + (convs.length + 1), msgs: [] },
      ];
      setCurrentConversation(convs.length, newConvs);
      return newConvs;
    });
  };

  const updateConversation = (i, msgs) => {
    setConversations((convs) => {
      let updatedConversations = [...convs];
      updatedConversations[i].msgs = [...msgs];
      return updatedConversations;
    });
  };

  const setCurrentConversation = (i, convs) => {
    convIndexRef.current = i;
    setConvIndex(i);
    setMessages(convs[i].msgs);
  };

  useEffect(() => {
    if (conversations.length < 1) {
      if (localStorage.getItem('conversations') !== null) {
        setConversations(JSON.parse(localStorage.getItem('conversations')));
        setCurrentConversation(
          JSON.parse(localStorage.getItem('conversations')).length - 1,
          JSON.parse(localStorage.getItem('conversations'))
        );
      } else {
        newConversation();
      }
    }
  }, []);

  useEffect(() => {
    setReversedConvs([...conversations].reverse());
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    updateConversation(convIndex, messages);
  }, [messages]);

  const addUserMessage = (msg) => {
    let newMessage = { role: 'user', content: msg };
    setMessages((messages) => [...messages, newMessage]);
    addAssistantMessage('');
    postMessages([...messages, newMessage]);
  };

  const addAssistantMessage = (msg) => {
    let newMessage = { role: 'assistant', content: msg };
    setMessages((messages) => {
      return [...messages, newMessage];
    });
  };

  const editMessage = (index, text) => {
    let messageToEdit;
    setMessages((prevMessages) => {
      messageToEdit = prevMessages[index];
      messageToEdit.content = text;
      let updatedMessages = [...prevMessages];
      updatedMessages.splice(index, 1, messageToEdit);
      if (messageToEdit.role === 'user') {
        console.log('user');
      }
      return updatedMessages;
    });
  };

  const postMessages = async (messagesToPost) => {
    if (postMessagesController.current) {
      postMessagesController.current.abort();
    }

    postMessagesController.current = new AbortController();
    const response = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cors: 'no-cors',
      },
      body: JSON.stringify([
        {
          role: 'system',
          content: `All the responses you generate are displayed by a commonmark markdown renderer, use this to display images code headings etc. If a user asks for an image you can use commonmark syntax to display it, if a user asks you to give them a link to something use commonmark syntax to display it. If you write code it is going through prismjs to render it so you always have to specify what programming language the code is, if it isn't a programming language the language is plaintext.`,
        },
        ...messagesToPost,
      ]),
      signal: postMessagesController.current.signal,
    });

    let assistantResponseText = '';
    setReceivingMessage(true);
    const index = convIndexRef.current;

    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();

    reader.read().then(function processText({ done, value }) {
      const lines = value.split('\n');

      if (done) {
        reader.cancel();
        return;
      }

      for (let i in lines) {
        if (lines[i].length === 0) continue; // ignore empty message
        if (lines[i].startsWith(':')) continue; // ignore comment message
        if (lines[i] === 'data: [DONE]') {
          setReceivingMessage(false);
          console.log('done');
          reader.cancel();
          return;
        } // end of message
        try {
          let json = JSON.parse(lines[i]);
          assistantResponseText = assistantResponseText + json.data;
          console.log(convIndexRef.current, index);
          if (convIndexRef.current == index) {
            editMessage(messagesToPost.length, assistantResponseText);
          } else {
            console.log('safhldjk');
            setConversations((convs) => {
              let newConvs = [...convs];
              newConvs[index].msgs = [...newConvs[index].msgs];
              newConvs[index].msgs[messagesToPost.length].content =
                assistantResponseText;
              localStorage.setItem('conversations', JSON.stringify(newConvs));
              return newConvs;
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
      return reader.read().then(processText);
    });
  };

  useEffect(() => {
    const regex = /^New Chat \d+$/;
    if (
      !receivingMessage &&
      messages.length >= 2 &&
      messages[messages.length - 1].content &&
      regex.test(conversations[convIndexRef.current].name)
    ) {
      getNameConvo(messages, convIndexRef.current);
    }
  }, [receivingMessage, messages]);

  const getNameConvo = async (messagesToPost, index) => {
    if (getNameConvoController.current) {
      getNameConvoController.current.abort();
    }

    getNameConvoController.current = new AbortController();
    const response = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cors: 'no-cors',
      },
      body: JSON.stringify([
        {
          role: 'system',
          content: `Your job is to take a user message and an assistant message and generate a very short name to describe the topic of the conversation. This does not include the message telling you to name the conversation. Never say anything but the name for the conversation because whatever you respond with will be automatically sent to the server as the name of the conversation. Examples of good names: Grocery Planning, Javascript HTTP Request, Lord Of The Flies Essay, Antonym for Confidence, Books to Read, Saying Hi`,
        },
        ...messagesToPost,
        {
          role: 'user',
          content: `Can you please generate a very short name to describe the topic of the previous conversation NOT INCLUDING THIS MESSAGE. Mak sure you don't say anything but the name for the conversation because whatever you respond with will be automatically sent to the server as the name of the conversation. Examples of good names: Grocery Planning, Javascript HTTP Request, Lord Of The Flies Essay, Antonym for Confidence, Books to Read, Saying Hi`,
        },
      ]),
      signal: getNameConvoController.current.signal,
    });

    let assistantResponseText = '';

    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();

    reader.read().then(function processText({ done, value }) {
      if (done) {
        reader.cancel();
        return;
      }
      const lines = value.split('\n');

      for (let i in lines) {
        if (lines[i].length === 0) continue; // ignore empty message
        if (lines[i].startsWith(':')) continue; // ignore comment message
        if (lines[i] === 'data: [DONE]') return; // end of message
        try {
          let json = JSON.parse(lines[i]);
          assistantResponseText = assistantResponseText + json.data;
          setConversations((convs) => {
            let newConversations = [...convs];
            newConversations[index].name = assistantResponseText;
            return newConversations;
          });
        } catch (e) {
          console.error(e);
        }
      }
      return reader.read().then(processText);
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    addUserMessage(message);
    setMessage('');
  };

  useEffect(() => {
    if (conversations[convIndex]) {
      document.title = conversations[convIndex].name;
    }
  }, [editText, conversations]);

  return (
    <div className='App'>
      <div className={Styles.container}>
        <div className={Styles.sidebar}>
          <button
            id={Styles.newchat}
            onClick={() => {
              setMessage('');
              newConversation();
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
              <line x1='12' y1='5' x2='12' y2='19'></line>
              <line x1='5' y1='12' x2='19' y2='12'></line>
            </svg>
            New chat
          </button>
          <div id={Styles.conversationsList}>
            {reversedConvs.map((conv, index) =>
              conversations.length - index - 1 == convIndex ? (
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
                  {conversations.length - index - 1 == editId ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setConversations((convs) => {
                          let newConversations = [...convs];
                          newConversations[editId].name = editText;
                          return newConversations;
                        });
                        setEditId(-1);
                        setEditText('');
                      }}
                    >
                      <input
                        autoFocus={true}
                        className={Styles.editNameInput}
                        onChange={(e) => {
                          setEditText(e.target.value);
                        }}
                        value={editText}
                      ></input>
                    </form>
                  ) : (
                    <p>{conv.name}</p>
                  )}
                  <div></div>

                  {conversations.length - index - 1 == editId ? (
                    <div className={Styles.convoButtons}>
                      <button
                        className={Styles.editConvoName}
                        onClick={() => {
                          setEditId(conversations.length - index - 1);
                          setEditText(conv.name);
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
                          setEditId(conversations.length - index - 1);
                          setEditText(conv.name);
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
                          setConversations((convs) => {
                            let newConversations = [...convs];
                            newConversations.splice(
                              conversations.length - index - 1,
                              1
                            );
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
                    setCurrentConversation(
                      conversations.length - index - 1,
                      conversations
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
                setConversations([]);
                newConversation();
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
        <div ref={messagesOuterDiv} className={Styles.messagesOuterContainer}>
          {messages.length > 0 ? (
            <Messages>
              {messages.map((msg, index) =>
                msg.role == 'user' ? (
                  <UserMessage key={index}>{msg.content}</UserMessage>
                ) : (
                  <AssistantMessage key={index}>{msg.content}</AssistantMessage>
                )
              )}
              <div id={Styles.bottomDiv}></div>
            </Messages>
          ) : (
            <HomePage callback={setMessage} />
          )}

          <div id={Styles.bottomBar}>
            <div id={Styles.bottomBarTop}>
              <div></div>
              <div id={Styles.bottomCenter}>
                {messages.length > 0 ? (
                  <>
                    {receivingMessage ? (
                      <button
                        id={Styles.stopReceivingButton}
                        onClick={() => {
                          postMessagesController.current.abort();
                        }}
                      >
                        <svg
                          stroke='currentColor'
                          fill='none'
                          stroke-width='1.5'
                          viewBox='0 0 24 24'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                          class='h-3 w-3'
                          height='1em'
                          width='1em'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <rect
                            x='3'
                            y='3'
                            width='18'
                            height='18'
                            rx='2'
                            ry='2'
                          ></rect>
                        </svg>
                        Stop generating
                      </button>
                    ) : (
                      <button
                        id={Styles.regenerateBtn}
                        onClick={() => {
                          let newMessages = [...messages];
                          newMessages.splice(-1, 1);
                          postMessages(newMessages);
                        }}
                      >
                        <svg
                          stroke='currentColor'
                          fill='none'
                          stroke-width='1.5'
                          viewBox='0 0 24 24'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                          height='1em'
                          width='1em'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <polyline points='1 4 1 10 7 10'></polyline>
                          <polyline points='23 20 23 14 17 14'></polyline>
                          <path d='M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'></path>
                        </svg>
                        Regenerate Response
                      </button>
                    )}
                  </>
                ) : (
                  <div></div>
                )}

                <div id={Styles.input}>
                  <form
                    id={Styles.inputForm}
                    onSubmit={(e) => {
                      submitForm(e);
                    }}
                  >
                    <TextareaAutosize
                      id={Styles.inputTextArea}
                      type='text'
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          submitForm(e);
                        }
                      }}
                      value={message}
                      placeholder='Send a message...'
                    />
                    <button id={Styles.sendButton} type='submit'>
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
                        <line x1='22' y1='2' x2='11' y2='13'></line>
                        <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
              <div></div>
            </div>
            <div id={Styles.bottomBarBottom}>
              ChatGPT Clone developed with love from your moms bedroom.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
