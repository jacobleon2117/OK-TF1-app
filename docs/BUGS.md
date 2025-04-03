# Bugs for the signup screen.

- auto password makes the password fields broken. Unable to type in the fields after it provides a auto password. After typing in the password fields the apple keyboard doesn't show up

- Apply keyboard not showing up on name, email, and code first load.

- Repeat email allows user to create another account. E.x. user used the same email twice to create 2 accounts.

# Fix unused "name" in code snippet

// Signup function
  const signup = async (name: string, email: string, password: string, organizationCode: string) => {
    setError(null);
    try {
      // Verify organization code first
      if (!verifyOrganizationCode(organizationCode)) {
        throw new Error("Invalid organization code");
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Here you would also store additional user data in Firestore
      // For example, the user's name and organization code
      // This requires adding Firestore to your project
      
      // For now, we'll just update the user's display name
      // await updateProfile(userCredential.user, { displayName: name });
      
      return userCredential;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

# Forgot password page

- Broken "Back to Login" button.