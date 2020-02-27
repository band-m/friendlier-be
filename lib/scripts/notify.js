require('dotenv').config();
require('../utils/connect')();
const webPush = require('web-push');
const User = require('../models/User');
const notify = async() => {
  const now = new Date();
  // const users = await User
  //   .find({ pushHour: now.getUTCHours(), wantsPush: true })
  //   .populate('contacts')
  //   .execPopulate();

  const users = await User
    .find({ wantsPush: true });
  console.log(JSON.stringify(users), 'users');

  const sendPush = async(subscription, textPayload) => {
    const pushOptions = {
      vapidDetails: {
        subject: 'http://frontend.url.goes.here',
        privateKey: process.env.PRIVATE_VAPID_KEY,
        publicKey: process.env.PUBLIC_VAPID_KEY
      },
      headers: {}
    };
    return await webPush.sendNotification(subscription, textPayload, pushOptions);
  };
  const formatDate = (date) => date.toISOString().split('T')[0];

  return await Promise.all(users.map(async(user) => {
    return Promise.all(user.contacts.map((contact) => {
      const today = formatDate(new Date());
      if(contact && contact.redZoneStartDate) {
        const rzDate = formatDate(contact.redZoneStartDate);
        if(today === rzDate) {
          return sendPush(user.subscription, `${contact.firstName} ${contact.lastName} entered the red zone.`);
        }
      }
    }));
  }));
};

notify()
  .then(() => console.log('Push notifications completed.'));
