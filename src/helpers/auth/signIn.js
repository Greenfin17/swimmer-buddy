import { signInWithPopup } from 'firebase/auth';

const signIn = async (authInit, provider) => {
  signInWithPopup(authInit, provider)
    .then((result) => {
      console.warn(result.user);
    })
    .catch((error) => {
      console.warn(error.message);
    });
};

export default signIn;
