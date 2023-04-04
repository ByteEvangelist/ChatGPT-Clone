import { useEffect, useState } from 'react'
import {createParser} from 'eventsource-parser';
import ReactMarkdown from 'react-markdown'
import CodeBlock from './Components/CodeBlock';
import Styles from './App.module.css'

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const addUserMessage = (msg) => {
    let newMessage = {role: 'user', content: msg};
    setMessages((messages) => [...messages, newMessage]);
    addAssistantMessage('');
    postMessages([...messages, newMessage]);
  }

  const addAssistantMessage = (msg) => {
    let newMessage = {role: 'assistant', content: msg};
    setMessages((messages) => {
      return [...messages, newMessage]
    })
    
  }

  const editMessage = (index, text) => {
    let messageToEdit;
    setMessages(prevMessages => {
      messageToEdit = prevMessages[index];
      messageToEdit.content = text;
      let updatedMessages = [...prevMessages];
      updatedMessages.splice(index, 1, messageToEdit);
      if(messageToEdit.role === 'user'){
        console.log('user');
      }
      return updatedMessages;
    });
  }

  const postMessages = async (messagesToPost) => {
    const response = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cors': 'no-cors'
      },
      body: JSON.stringify(messagesToPost)
    })

//    const parser = createParser(onParse);

    
    let assistantResponseText = '';

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();      

    reader.read().then(function processText({done, value}){
      const lines = (value).split('\n');

      for (let i in lines) {
        if (lines[i].length === 0) continue;     // ignore empty message
        if (lines[i].startsWith(':')) continue;  // ignore comment message
        if (lines[i] === 'data: [DONE]') return; // end of message
        try{
          let json = JSON.parse(lines[i]);
          console.log(json);
          assistantResponseText = assistantResponseText + json.data;
          editMessage(messagesToPost.length, assistantResponseText); 
        }catch (e){
          console.log(e);
        }
 
      }
      return reader.read().then(processText);
    });


/*
    function onParse(event) {
      if (event.data !== '[DONE]') {
        console.log(event);
        assistantResponseText = assistantResponseText + event.data;
        editMessage(messagesToPost.length, assistantResponseText);
      }
      else{
        parser.reset();
      }
    }*/
  }

  return (
    <div className="App">
      {messages.map((msg, index) => (
        msg.role == 'user' ? 
          <li key={index}><ReactMarkdown components={{ code: CodeBlock }}>{msg.content}</ReactMarkdown></li>
            : 
          <li key={index} style={{backgroundColor: 'red'}}><ReactMarkdown components={{ code: CodeBlock }}>{msg.content}</ReactMarkdown> </li>       
      ))}
      <form onSubmit={(e) => {
        e.preventDefault(); 
        addUserMessage(message); 
        setMessage('');
      }}>
        <textarea type="text" onChange={(e) => setMessage(e.target.value)} value={message}></textarea>
        <button type='submit'>Send</button>
      </form>
      <button onClick={() => {
        let newMessages = [...messages]; 
        newMessages.splice(-1,1); 
        postMessages(newMessages);
      }} >
      Resend
      </button>
    </div>
  )
}

export default App