import * as firebase from 'firebase/app'
import 'firebase/auth'
import { useContext } from 'react'
import { userContext } from './user-context'

const provider = new firebase.auth.GoogleAuthProvider()

export const useSession = (): firebase.User => {
  const { user } = useContext(userContext)
  return user
}

export const loginWithGoogle = async (): Promise<any> => {
  try {
    return firebase.auth().signInWithPopup(provider)
  } catch (err) {
    throw err
  }
}

const github = new firebase.auth.GithubAuthProvider()

export const loginWithGithub = async (): Promise<any> => {
  try {
    return firebase.auth().signInWithPopup(github)
  } catch (err) {
    throw err
  }
}

export const loginWithEmail = async (email: string, password: string): Promise<any> => {
  try {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  } catch (err) {
    throw err
  }
}

export const createUserWithEmail = async (email: string, password: string): Promise<any> => {
  try {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
  } catch (err) {
    throw err
  }
}

export const sendPasswordResetEmail = async (email: string): Promise<any> => {
  try {
    return firebase.auth().sendPasswordResetEmail(email)
  } catch (err) {
    throw err
  }
}

export const signOut = (): Promise<any> => firebase.auth().signOut()
