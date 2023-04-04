import { Configuration, OpenAIApi } from 'openai';
import {createParser} from 'eventsource-parser';
import dotenv from 'dotenv';
import he from 'he';
import express from 'express';
dotenv.config();

const app = express();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(express.json());
app.post('/', async (req, res) => {
  console.log('post');
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();
  let response;
  while (true) {
    try {
      response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
          },
          method: "POST",
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: req.body,
            stream: true
          }),
          timeout: 60000 // Timeout value in milliseconds
        }
      );
      break;
    } catch (error) {
      console.error("Fetch error: ", error);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
    }
  }
  const parser = createParser(onParse);

  for await (const value of response.body?.pipeThrough(new TextDecoderStream())) {   
    parser.feed(value)
  }
  function onParse(event) {
    if (event.type === 'event') {
      if (event.data !== '[DONE]') {
        let chunk = `${JSON.stringify({data: JSON.parse(event.data).choices[0].delta?.content || ""})}\n\n`;
        res.write(chunk)
      }
      else{
        let chunk = `data: ${'[DONE]'}\n\n`;
        res.write(chunk);
      }
    } else if (event.type === 'reconnect-interval') {
      console.log('We should set reconnect interval to %d milliseconds', event.value);
    }
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});