import firebase from "firebase/app";

import auth from "../../firebase";

export const login = () => async dispatch => {
  try {
    dispatch({
      type: "LOGIN_REQUEST",
    });

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/youtube.force-ssl");

    const res = await auth.signInWithPopup(provider);
    const accessToken = res.credential.accessToken;

    const profile = {
      name: res.additionalUserInfo.profile.name,
      photoURL: res.additionalUserInfo.profile.picture,
    };

    localStorage.setItem("ytc-access-token", accessToken);
    localStorage.setItem("ytc-user", JSON.stringify(profile));

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: accessToken,
    });

    dispatch({
      type: "LOAD_PROFILE",
      payload: profile,
    });
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "LOGIN_FAIL",
      payload: err.message,
    });
  }
};

export const log_out = () => async dispatch => {
  await auth.signOut();
  dispatch({
    type: "LOG_OUT",
  });

  localStorage.clear();
};
