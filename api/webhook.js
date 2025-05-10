export default function handler(req, res) {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  
    if (req.method === 'GET') {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];
  
      if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
          console.log('WEBHOOK_VERIFIED');
          return res.status(200).send(challenge);
        } else {
          return res.sendStatus(403);
        }
      } else {
        return res.sendStatus(400);
      }
    }
  
    res.sendStatus(404);
  }
  