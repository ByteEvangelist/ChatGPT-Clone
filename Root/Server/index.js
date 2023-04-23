// todo: replace with text decoder and reader
import { createParser } from 'eventsource-parser'; // used for parsing stream from openai
import dotenv from 'dotenv';
import express from 'express'; //better than native http
// todo: add allowed domains to env so not all domains can make requests
import cors from 'cors'; //don't feel like setting headers myself

dotenv.config(); // initialize env
const app = express(); // initialize express

app.use(cors()); // allow requests from anywhere so frontend can be hosted on seperate url
app.use(express.json()); // parses json in body of post requests to express allows us to send data as json from frontend

// on post request received (from frontend)
app.post('/', async (req, res) => {
  // set the headers
  res.set({
    'Cache-Control': 'no-cache', // make sure response isn't cached and server returns new response every request
    'Content-Type': 'text/event-stream', // server side events, text will be streamed in as openai generates it
    Connection: 'keep-alive',
  });

  res.flushHeaders(); // automatically send headers before any data is written to the response body

  let response;
  while (true) {
    // keep trying the request until it succeeds
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // attach api key
        },
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // chatgpt model
          messages: [...req.body], // forward messages received from client
          stream: true, // stream back messages
        }),
        timeout: 60000, // Timeout value in milliseconds
      });
      break; // request succeded so end the while loop
    } catch (error) {
      console.error('Fetch error: ', error);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying (stays in catch state until promise resolves)
    }
  }

  const parser = createParser(onParse); // initialize event source parser. used to parse stream from openai

  for await (const value of response.body?.pipeThrough(
    new TextDecoderStream() // feed data as it is received
  )) {
    parser.feed(value); // feed data to parser
  }

  //called as data is received
  function onParse(event) {
    if (event.type === 'event') {
      // if chunk is [DONE] send back done if not send back recieved tokens
      if (event.data !== '[DONE]') {
        // convert to object with response text as data value (usually 1-2 tokens) then stringify to json
        let chunk = `${JSON.stringify({
          data: JSON.parse(event.data).choices[0].delta?.content || '',
        })}\n\n`; // \n\n signals end of chunk
        // send chunk back to client (write to stream)
        res.write(chunk);
      } else {
        // send onject with value of [DONE] to signal stream has finished
        let chunk = `data: ${'[DONE]'}\n\n`; // (\n\n signals end of chunk)
        // send chunk back to client (write to stream)
        res.write(chunk);
      }
    } else if (event.type === 'reconnect-interval') {
      // stream disconnected
      console.log(
        'We should set reconnect interval to %d milliseconds',
        event.value
      );
    }
  }
});

// start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
