import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytesResumable } from "firebase/storage"

import { upload } from './upload.js'

const firebaseConfig = {
  apiKey: "AIzaSyA1HMgmnXwvp4xgtzYvOQ-WFkvsiA3XMQ0",
  authDomain: "file-upload-3814e.firebaseapp.com",
  projectId: "file-upload-3814e",
  storageBucket: "file-upload-3814e.appspot.com",
  messagingSenderId: "478306403015",
  appId: "1:478306403015:web:377d887fe61fee901cf4e2"
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