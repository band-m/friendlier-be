const webPush = require('web-push');
const Subscription = require('../models/Subscription');
const notify = async() => {
  const now = new Date();
  const subscriptions = await Subscription
    .find({ pushHour: now.getUTCHours() });

  subscriptions.map((subscription) => {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
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
