addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(req, res) {
  let url = new URL(req.url);
  if (req.method === 'GET') {
    let response;
    try {
      // test request to openai that just lists the models
      response = await fetch('https://test.blueridgegrizzly.com/info', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // await response
      let json = await response.json();
      // if receive error send back that openai isn't responding and the error
      if (json.error) {
        response = new Response(
          `<ul><li>hf inference not responding ❌ (error: ${json.error.code})</li></ul>`,
          { headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
        );
      } else {
        response = new Response('<ul><li>hf inference responding✅</li></ul>', {
          headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
      }
    } catch (error) {
      console.error('Fetch error: ', error);
      response = new Response(
        `<ul><li>fetch error ❌ (fetch error: ${error})</li></ul>`,
        { headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
      );
    }
    return response;
  } else if (req.method === 'POST') {
    let hfResponse;
    while (true) {
      // keep trying the request until it succeeds
      try {
        const reqBody = await req.json();
        console.log(JSON.stringify(reqBody));
        hfResponse = await fetch(
          'https://test.blueridgegrizzly.com/generate_stream',
          {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              inputs:
                reqBody
                  .map((obj) => {
                    if (obj.role == 'user') {
                      return 'User:' + obj.content + '\n';
                    } else {
                      if (obj.role == 'system') {
                        return obj.content + '\n';
                      } else {
                        return 'Assistant:' + obj.content + '\n';
                      }
                    }
                  })
                  .join('') + 'Assistant:',
              parameters: {
                best_of: 1,
                details: true,
                do_sample: true,
                max_new_tokens: 1000,
                repetition_penalty: 1.03,
                return_full_text: false,
                seed: null,
                temperature: 0.5,
                top_k: 10,
                top_p: 0.95,
                truncate: null,
                typical_p: 0.95,
                watermark: false,
              },
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

    const reader = hfResponse.body.getReader();
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
        const fullChunk = accumulatedData;

        if (fullChunk.length > 1) {
          try {
            if (JSON.parse(fullChunk.slice(5)).details != undefined) {
              console.log('done');
              writer.write(encoder.encode('data: [DONE]'));
              writer.close();
              return Promise.resolve();
            }
            console.log(
              'fullchunk:' +
                fullChunk.length +
                ' ' +
                JSON.parse(fullChunk.slice(5)).token.text
            );
            writer.write(
              encoder.encode(
                `${JSON.stringify({
                  data: JSON.parse(fullChunk.slice(5)).token.text,
                })}\n\n`
              )
            );
          } catch (error) {
            console.log(error.message);
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
