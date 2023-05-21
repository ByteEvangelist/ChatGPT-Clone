addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(req, res) {
  let url = new URL(req.url);
  if (req.method === 'GET') {
    let response;
    try {
      // test request to openai that just lists the models
      response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`, // attach api key
        },
      });
      // await response
      let json = await response.json();
      // if receive error send back that openai isn't responding and the error
      if (json.error) {
        response = new Response(
          `<ul><li>server online ✅</li><li>openai not responding ❌ (error: ${json.error.code})</li></ul>`,
          { headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
        );
      } else {
        response = new Response(
          '<ul><li>server online ✅</li><li>openai responding ✅</li></ul>',
          { headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
        );
      }
    } catch (error) {
      console.error('Fetch error: ', error);
      response = new Response(
        `<ul><li>server online ✅</li><li>openai fetch error ❌ (fetch error: ${error})</li></ul>`,
        { headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
      );
    }
    return response;
  } else if (req.method === 'POST') {
    let openaiResponse;
    while (true) {
      // keep trying the request until it succeeds
      try {
        const reqBody = await req.json();
        openaiResponse = await fetch(
          'https://api.openai.com/v1/chat/completions',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${OPENAI_API_KEY}`, // attach api key
            },
            method: 'POST',
            body: JSON.stringify({
              model: 'gpt-3.5-turbo', // chatgpt model
              messages: [...reqBody], // forward messages received from client
              stream: true, // stream back messages
            }),
            timeout: 60000, // Timeout value in milliseconds
          }
        );
        break; // request succeded so end the while loop
      } catch (error) {
        console.log('Error name:', error.name);
        console.log('Error message:', error.message);
        console.log('Error stack:', error.stack);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying (stays in catch state until promise resolves)
      }
    }

    const { readable, writable } = new TransformStream();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const writer = writable.getWriter();

    const reader = openaiResponse.body.getReader();
    let accumulatedData = '';
    reader.read().then(function processText({ done, value }) {
      if (done) {
        writer.close();
        return Promise.resolve();
      }
      accumulatedData += decoder.decode(value, { stream: true });

      // Check if a complete chunk is found with newline delimiter
      let newlineIndex = accumulatedData.indexOf('\n');
      while (newlineIndex !== -1) {
        const fullChunk = accumulatedData.slice(0, newlineIndex).trim();
        if (fullChunk.length > 0) {
          if (fullChunk == 'data: [DONE]') {
            writer.write(encoder.encode('data: [DONE]'));
            writer.close();
            return Promise.resolve();
          }
          if (JSON.parse(fullChunk.slice(5)).choices[0].delta.content) {
            // Only log non-empty chunks
            writer.write(
              encoder.encode(
                `${JSON.stringify({
                  data: JSON.parse(fullChunk.slice(5)).choices[0].delta.content,
                })}\n\n`
              )
            );
          }
        }
        accumulatedData = accumulatedData.slice(newlineIndex + 1);
        newlineIndex = accumulatedData.indexOf('\n');
      }
      return reader.read().then(processText);
    });

    const response = new Response(readable, {
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });
    return response;
  } else if (req.method === 'OPTIONS') {
    let respHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
      'Access-Control-Allow-Headers': req.headers.get(
        'Access-Control-Request-Headers'
      ),
      'Access-Control-Max-Age': '86400',
    };
    return new Response(null, {
      headers: respHeaders,
    });
  }
}
