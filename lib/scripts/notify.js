require('dotenv').config();
require('../utils/connect')();
const webPush = require('web-push');
const User = require('../models/User');
require('../models/Contact');
const notify = async() => {
  const now = new Date();
  const users = await User
    .find({ pushHour: now.getUTCHours(), wantsPush: true })
    .populate('contacts');

  const sendPush = async(subscription, textPayload) => {
    const pushOptions = {
      vapidDetails: {
        subject: 'https://friendlier-staging.netlify.com/',
        privateKey: process.env.PRIVATE_VAPID_KEY,
        publicKey: process.env.PUBLIC_VAPID_KEY
      },
      headers: {}
    };
    return await webPush.sendNotification(subscription, textPayload, pushOptions);
  };
  const formatDate = (date) => date && date.toISOString().split('T')[0];
  const today = formatDate(now);
  const notifyZone = async([zoneKey, text]) => {
    return Promise.all(users.map(async(user) => {
      const contacts = user && user.contacts && user.contacts.filter((contact) => {
        return today === formatDate(contact[zoneKey]);
      });
      return contacts && Promise.all(contacts.map((contact) => {
        return sendPush(user.subscription, `${contact.firstName} ${contact.lastName} ${text}`);
      }));
    }));
  };

  const zones = [['yellowZoneStartDate', 'entered the yellow zone'], 
    ['redZoneStartDate', 'entered the red zone']];

  return Promise.all(zones.map(notifyZone));
};

notify()
  .then(() => console.log('Push notifications completed.'));
