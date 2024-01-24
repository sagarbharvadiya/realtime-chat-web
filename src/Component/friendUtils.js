// FriendUtils.js
import { db } from './firebase';
import { addDoc, collection } from 'firebase/firestore';

export const sendFriendRequest = async (userId, requesterId) => {
  const friendsCollection = collection(db, 'friends');
  await addDoc(friendsCollection, { userId, requesterId, status: 'pending' });
};

export const acceptFriendRequest = async (requestId) => {
  // Implement logic to accept the friend request
};
