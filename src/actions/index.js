import { FETCH_USER, SIGNIN_ERROR, FETCH_LOADING, FETCH_NOTFOUND, FETCH_SUCCESS, SET_RESUME_ACTIVE, ADD_NEW_RESUME, DELETE_RESUME, SAVING_RESUME, SAVED_RESUME, SET_FORMTAB_ACTIVE } from './types';
import { config, authRef, databaseRef, provider } from "../config/firebase";
import * as firebase from "firebase";
import history from '../components/auth/history';
import { SubmissionError } from 'redux-form';

import axios from 'axios';

function fetchLoading(bool, data) {
  return {
      type: FETCH_LOADING,
      loading: bool,
  };
}

function fetchNotFound(bool) {
  return {
      type: FETCH_NOTFOUND,
      notFound: bool,
  };
}

function fetchSuccess(bool, resumes) {
  return {
      type: FETCH_SUCCESS,
      loading: bool,
      payload : resumes
  }
}

export function setActiveResume(bool, key) {
  return {
    type: SET_RESUME_ACTIVE,
    loading: bool,
    payload: key
  }
}

export function setActiveFormtab(tab) {
  return {
    type: SET_FORMTAB_ACTIVE,
    payload: tab
  }
}

export const fetchUserResumes = uid => async dispatch => {
  databaseRef.orderByChild("user").equalTo(uid)
  .once('value', snap => {
    if(!snap.val()) {
      dispatch(fetchSuccess(false, "" ));
    } else {
      dispatch(fetchSuccess(false, snap.val() ));
    }
  })
}

export const newResume = (bool, values) => async dispatch => {
  return firebase.database().ref('resumes/').push(values)
    .then((snap) => {
      let key = snap.key;
     dispatch({
       type: ADD_NEW_RESUME,
       loading: bool,
       key: key,
       resume: values
     })
   })
}

export const duplicateResume = (oldKey) => async dispatch => {
  firebase.database().ref(`resumes/${oldKey}`)
  .on("value", (snap1) => {
    let values = snap1.val();
    values.name = `copy of ${snap1.val().name}`;
    console.log(values)
    return firebase.database().ref('resumes/')
      .push(values)
      .then((snap2) => {
        console.log(snap2)
         let key = snap2.key;
         dispatch({
           type: ADD_NEW_RESUME,
           key: key,
           resume: values,
         })
      })
  })
}

export const deleteResume = key => async dispatch => {
  console.log('(soft) deleting resume');
  firebase.database().ref(`resumes/${key}`)
  .update({ "status" : "inactive" })
  .then((snap) => {
      dispatch({
        type: DELETE_RESUME,
        key: key
      })
    })
}

export const postResumeValue = (values, key) => async dispatch => {
  dispatch({ type: SAVING_RESUME });
  firebase.database().ref(`resumes/${key}`)
  .set(values)
  .then(data => {
    setTimeout(() => {
      let d = new Date();
      let h = d.getHours();
      let m = (d.getMinutes()<10?'0':'') + d.getMinutes();
      let time = h + "h" + m
      dispatch({
        type: SAVED_RESUME,
        payload: time
      })
    }, 200)

  })
}

/*** PUBLIC RESUME PAGE ***/
export const fetchResume = (key) => async dispatch => {
  dispatch(fetchLoading(true))
  const url = config.databaseURL + `resumes/${key}/` + config.auth;
  return axios.get(url)
  .then(data => {
    if(!data) {
      dispatch(fetchNotFound(true))
    } else if(data.data.status != "active") {
      dispatch(fetchNotFound(true));
    } else {
      dispatch(fetchSuccess(false, data.data, key));
    }
  })
  .catch(error => console.log('BAD', error))
}

/*** AUTHENTICATION ***/
export const fetchUser = () => dispatch => {
  authRef.onAuthStateChanged(user => {
    if (user) {
      dispatch({
        type: FETCH_USER,
        payload: user
      });
    } else {
      dispatch({
        type: FETCH_USER,
        payload: null
      })
    }
  })
};

export const signUpPass = (values) => dispatch => {
  const email = values.email;
  const pass = values.password;
  authRef
  .createUserWithEmailAndPassword(email, pass)
  .catch(function(error) {
    console.log(error.message);
    dispatch({
      type: SIGNIN_ERROR,
      payload: error.message
    })
  });
}

export const signIn = (values) => dispatch => {
  const email = values.email;
  const pass = values.password;
  if(email && pass) {
    console.log("with pass")
    authRef
    .signInWithEmailAndPassword(email, pass)
    .then(result => {
      console.log("done!")
      history.push('/user')
    })
    .catch(function(error) {
      console.log(error.message);
      dispatch({
        type: SIGNIN_ERROR,
        payload: error.message
      })
    });
  } else {
    authRef
      .signInWithPopup(provider)
      .then(result => {
        console.log("done!")
        history.push('/user')

      })
      .catch(error => {
        console.log(error);
      });
  }
};

export const signInForgot = (email) => dispatch => {
  authRef
  .sendPasswordResetEmail(email)
  .then(function() {
    console.log('email send')
  }).catch(function(error) {
    console.log(error)
  });
}

export const signOut = () => dispatch => {
  authRef
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch(error => {
      console.log(error);
    });
};
