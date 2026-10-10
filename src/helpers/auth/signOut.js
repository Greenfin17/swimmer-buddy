import { signOut } from 'firebase/auth';

const signOutApp = async (authInit) => {
  await signOut(authInit);
};

export default signOutApp;
