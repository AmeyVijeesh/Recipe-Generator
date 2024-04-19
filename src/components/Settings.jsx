import React, { useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase.js';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  deleteDoc,
  getFirestore,
} from 'firebase/firestore';
import './settings.css';

const Settings = ({ profilePicture, setProfilePicture, user }) => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const storageRef = ref(
      storage,
      `profile_pictures/${user.uid}/${file.name}`
    );
    try {
      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { profilePic: downloadURL }, { merge: true });

      setProfilePicture(downloadURL);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      if (user && user.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setProfilePicture(userData.profilePic);
        }
      } else {
        setProfilePicture(
          'https://th.bing.com/th/id/OIP.hmLglIuAaL31MXNFuTGBgAAAAA?rs=1&pid=ImgDetMain'
        );
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfilePicture();
    }
  }, [user]);
  return (
    <>
      <div className="img-drop-cont">
        <div class="image-upload-wrap">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="file-upload-input"
          />

          <div class="drag-text">
            <h3>Drag and drop a file or click to add an image</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
