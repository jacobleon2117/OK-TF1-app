import { doc, getDoc, updateDoc, setDoc, where, query, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Function to make a specific user an admin
 * Note: This should be used once to set up your dad's account,
 * and then removed or protected with additional security
 * 
 * @param email The email address of the user to make admin
 * @returns Promise<boolean> Success or failure
 */
export const setupAdminAccount = async (email: string): Promise<boolean> => {
  try {
    // First, find the user by email
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', email)
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    
    if (usersSnapshot.empty) {
      console.error('User not found with the provided email');
      return false;
    }
    
    // Get the first user document (should be the only one with this email)
    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;
    
    // Update the user's role to admin
    await updateDoc(doc(db, 'users', userId), {
      role: 'admin',
      isCoordinator: true,
    });
    
    console.log(`User ${email} has been set as admin`);
    return true;
  } catch (error) {
    console.error('Error setting up admin account:', error);
    return false;
  }
};

/**
 * Function to check if a user has admin privileges
 * 
 * @param userId The user ID to check
 * @returns Promise<boolean> True if user is admin
 */
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return false;
    }
    
    const userData = userDoc.data();
    return userData.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};