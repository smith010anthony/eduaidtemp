import { Meteor } from 'meteor/meteor';

const { Client } = require('ssh2');
const crypto = require('crypto');
const Readable = require('stream').Readable;

const Settings = Meteor.settings.public;

const password = 'LEYwpNZarvd55xl7xCdOXkbmqzbfYhCc';
const encrypt = (input, pwd) => {
  let m = crypto.createHash('md5');
  m.update(pwd);
  const key = m.digest('hex');

  m = crypto.createHash('md5');
  m.update(pwd + key);
  const iv = m.digest('hex');

  const data = Buffer.from(input, 'utf8').toString('binary');

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv.slice(0, 16));

  const encrypted = cipher.update(data, 'utf8', 'binary') + cipher.final('binary');

  return Buffer.from(encrypted, 'binary').toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

function generateSignedFile(fileName) {
  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const date = new Date(now.toLocaleString());
  date.setMinutes(date.getMinutes() + 6);
  date.setDate(date.getDate() + 1);
  date.setMonth(date.getMonth() + 1);
  const expires = `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
  const signature = encrypt(`${expires}$${fileName}`, password);
  return `${Settings.sftp.fileUrl}?file=${signature}`;
}

function uploadFile(base64Content) {
  return new Promise((resolve, reject) => {
    const client = new Client();
    client.on('ready', () => {
      console.log('Ssh Client is ready');
      client.sftp((err, sftp) => {
        if (err) {
          reject(err);
          throw err;
        }
        sftp.readdir(Settings.sftp.imageLocation, (readErr) => {
          if (readErr) throw readErr;
          const [base64Prefix, base64Data] = base64Content.split(',');
          const extension = base64Prefix.substring('data:image/'.length, base64Prefix.indexOf(';base64'));
          if (!['jpeg', 'png'].includes(extension)) return;
          const imgBuffer = Buffer.from(base64Data, 'base64');
          const readStream = new Readable();
          readStream.push(imgBuffer);
          readStream.push(null);
          const date = new Date();
          const fileName = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}000`;
          const writeStream = sftp.createWriteStream(`${Settings.sftp.imageLocation}/${fileName}.${extension}`, { mode: 0o100664 });
          writeStream.on('close', () => {
            sftp.readdir(Settings.sftp.imageLocation, (errr) => {
              if (errr) {
                reject(errr);
                throw errr;
              }
              client.end();
              resolve(`${fileName}.${extension}`);
            });
          });
          readStream.pipe(writeStream);
        });
      });
    });
    client.on('timeout', () => {
      reject(new Error('timeout'));
    });
    client.on('error', (err) => {
      reject(new Error(err));
    });
    client.connect({
      host: Settings.sftp.host,
      port: Settings.sftp.port,
      username: Settings.sftp.username,
      password: Settings.sftp.password,
    });
  });
}


module.exports = {
  generateSignedFile,
  uploadFile,
};
