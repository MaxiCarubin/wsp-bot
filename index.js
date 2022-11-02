const fs = require('fs');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
var mime = require('mime-types');

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "wsp-maxi-bot" })
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', message => {
  if (message.body === '!image') {
    if (!message.hasMedia) message.reply('Send imge pls!');
    message.downloadMedia().then(media => {
      if (media) {
        const mediaPath = './downloaded-media/';
        if (!fs.existsSync(mediaPath)) {
          fs.mkdirSync(mediaPath);
        }
        const extension = mime.extension(media.mimetype);
        const filename = new Date().getTime();
        const fullFileName = mediaPath + filename + '.' + extension;
        // Save File
        try {
          fs.writeFileSync(fullFileName, media.data, { encoding: 'base64' });
          console.log('file Downloaded Succesfully', fullFileName);
          console.log(fullFileName);
          MessageMedia.fromFilePath(filePath = fullFileName);
          client.sendMessage(message.from, new MessageMedia(media.mimetype, media.data, filename), { sendMediaAsSticker: true, stickerAuthor: "Created by Bot", stickerName: "Stickers" });
          fs.unlinkSync(fullFileName);
          console.log('File Deleted Successfully');
        } catch (err) {
          console.log('Failed to Save the File', err);
          console.log('File Deleted Successfully');
        }
      }
    })
  }
});

client.initialize();


