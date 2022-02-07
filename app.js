import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytesResumable } from "firebase/storage"

import { upload } from './upload.js'
import { FIREBASE_API_TOKEN } from './firebase_api.js'

const firebaseConfig = {
  apiKey: FIREBASE_API_TOKEN,
  authDomain: "file-upload-dda84.firebaseapp.com",
  projectId: "file-upload-dda84",
  storageBucket: "file-upload-dda84.appspot.com",
  messagingSenderId: "393777250386",
  appId: "1:393777250386:web:db150251be458a878cdf8b"
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const storageRef = ref(storage, `images/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
        const block = blocks[index].querySelector('.preview-info-progress')
        block.textContent = percentage
        block.style.width = percentage
      }, error => {
        console.log(error, [])
      })
    })
  }
})