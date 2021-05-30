import firebase from 'firebase/app';
import 'firebase/storage';
import { Transforms } from 'slate';
import isUrl from 'is-url';
const imageExtensions = require('../util/imageExtensions.json');

const fileName = './commands/imageCommands.js';
var storage = 'Dev';

const firebaseConfig = {
  apiKey: 'AIzaSyBNTkJXewdc-uGCHudyXnJxGB0I1QnZbRQ',
  authDomain: 'rich-text-cb905.firebaseapp.com',
  projectId: 'rich-text-cb905',
  storageBucket: 'rich-text-cb905.appspot.com',
  messagingSenderId: '840547243181',
  appId: '1:840547243181:web:5beb56b5db7becafd56224',
};

firebase.initializeApp(firebaseConfig);

const ImageCommands = {
  addImageToStorage: async (imageInfo, failure) => {
    console.log(imageInfo);
    let { metaData, newImageId, image } = imageInfo;
    let uniqueID = Date.now();
    return new Promise((resolve, reject) => {
      const uploadTask = firebase
        .storage()
        .ref(storage + `/Images/${newImageId}_${uniqueID}`)
        .put(image, metaData);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // progress function ....
        },
        (error) => {
          // error function ....
          failure();
          ImageCommands.reportError(
            error,
            fileName,
            'addImageToStorage',
            'FeedbackView'
          );
          reject({ type: 'error_uploading', data: error });
        },
        () => {
          // complete function .....
          resolve({ type: 'upload_success', data: 'upload successful' });
          // TODO: need to pass this up somewhere
          ImageCommands.getImageUrl(newImageId, uniqueID);
        }
      );
    });
  },

  reportError(error, fileName, fxn, location) {
    console.log(`error: ${error}`);
    console.log(`fileName: ${fileName}`);
    console.log(`function: ${fxn}`);
    console.log(`location: ${location}`);
  },

  getImageUrl: async (imageName, uniqueID) => {
    let imageURL = await firebase
      .storage()
      .ref(storage + `/Images/${imageName}_${uniqueID}`)
      .getDownloadURL();
    return imageURL;
  },

  insertImage(editor, url) {
    const text = { text: '' };
    const image = [
      { type: 'image', url, children: [text] },
      { type: 'paragraph', children: [text] },
    ];
    Transforms.insertNodes(editor, image);
  },

  isImageUrl(url) {
    if (!url) return false;
    if (!isUrl(url)) return false;
    const ext = new URL(url).pathname.split('.').pop();
    return imageExtensions.includes(ext);
  },
};

export default ImageCommands;
