import getFirebase from './getFirebase';
import getFirebaseStorage from './getFirebaseStorage';

export default function uploadToStorage(
  data: string | Blob | Uint8Array | ArrayBuffer,
  fileName: string,
  fileType: 'blob' | 'data_url'
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    await getFirebaseStorage();
    const firebase = await getFirebase();

    const storage = firebase
      .app()
      .storage(process.env.NEXT_PUBLIC_FIREBASE_IMAGE_BUCKET);
    const storageRef = storage.ref();

    const metadata = {
      contentType: 'image/jpeg',
      cacheControl: `public,max-age=${30 * 24 * 60 * 60}` // 30 Days
    };

    let uploadTask;
    if (fileType === 'blob') {
      uploadTask = storageRef.child(fileName).put(data as Blob, metadata);
    } else if (fileType === 'data_url') {
      uploadTask = storageRef
        .child(fileName)
        .putString(data as string, 'data_url', metadata);
    } else {
      uploadTask = storageRef
        .child(fileName)
        .putString(data as string, fileType, metadata);
    }

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            break;
        }
      },
      error => {
        switch (error.code) {
          case 'storage/unauthorized':
            break;
          case 'storage/canceled':
            break;
          case 'storage/unknown':
            break;
        }
        reject();
      },
      () => {
        const imageUrl = `${process.env.NEXT_PUBLIC_CLOUD_STORAGE_ENDPOINT}/${process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME}/${fileName}`;
        resolve(imageUrl);
      }
    );
  });
}
