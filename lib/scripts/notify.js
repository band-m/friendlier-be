const webPush = require('web-push');
const User = require('../models/User');
const notify = async() => {
  const now = new Date();
  const users = await User
    .find({ pushHour: now.getUTCHours() });

  users.map((user) => {
    const pushSubscription = {
      endpoint: user.endpoint,
      keys: {
        p256dh: user.keys.p256dh,
        auth: user.keys.auth
      }
    };
    const pushPayload = { message: 'reminder text will go here' };

    const pushOptions = {
      vapidDetails: {
        subject: 'http://frontend.url.goes.here',
        privateKey: process.env.PRIVATE_VAPID_KEY,
        publicKey: process.env.PUBLIC_VAPID_KEY
      },
      headers: {}
    };
    webPush.sendNotification(pushSubscription, pushPayload, pushOptions);
  });
};

notify()
  .then(console.log('Push notifications completed.'));
