// Netlify serverless function — proxies ElevenLabs TTS so the API key stays secret
exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey  = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    return { statusCode: 503, body: 'Voice service not configured' };
  }

  let text;
  try {
    text = JSON.parse(event.body).text || '';
  } catch(e) {
    return { statusCode: 400, body: 'Invalid request body' };
  }

  if (!text.trim()) {
    return { statusCode: 400, body: 'No text provided' };
  }

  // Strip emojis before sending to TTS
  text = text.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}]/gu, '').trim();

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept':       'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key':   apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs error:', response.status, err);
      return { statusCode: response.status, body: 'TTS service error' };
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type':  'audio/mpeg',
        'Cache-Control': 'no-store',
      },
      body: base64Audio,
      isBase64Encoded: true,
    };
  } catch(err) {
    console.error('speak function error:', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};
