import firebase from 'firebase/app';
import 'firebase/storage';
import { Transforms } from 'slate';
import isUrl from 'is-url';
const imageExtensions = require('../util/imageExtensions.json');

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
  addImageToStorage: async (imageInfo, failure, updateUI) => {
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
          console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          // progress function ....
          updateUI(snapshot);
        },
        (error) => {
          // error function ....
          failure();
          reject({ type: 'error_uploading', data: error });
        },
        async () => {
          // complete function .....
          resolve({
            type: 'upload_success',
            data: 'upload successful',
            url: await ImageCommands.getImageUrl(newImageId, uniqueID),
          });
          // TODO: need to pass this up somewhere
          // let url = await ImageCommands.getImageUrl(newImageId, uniqueID);
          // return url;
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

  async uploadAndDisplay(event, editor, failure, updateUI) {
    let imageInfo = {
      metadata: {
        contentType: 'image/*',
      },
      newImageId: event.target.files[0].name,
      image: event.target.files[0],
    };
    let uploadResult = await ImageCommands.addImageToStorage(
      imageInfo,
      failure,
      updateUI
    );
    if (uploadResult.type === 'upload_success') {
      ImageCommands.insertImage(editor, uploadResult.url);
    }
  },
};

export default ImageCommands;
