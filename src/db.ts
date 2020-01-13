import debug from 'debug'
import 'firebase/analytics'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import isNil from 'lodash.isnil'
import omitBy from 'lodash.omitby'
import config from './firebase-config'

const log = debug('app:db')

firebase.initializeApp(config)
if (config.env !== 'dev') {
  firebase.analytics()
}

export const db = firebase.firestore()

interface UserType {
  displayName?: string
  email?: string
  photoURL: string
  uid: string
}

db.enablePersistence().catch((err): void => {
  console.error(err)
})

export function getUserFields(user: UserType): object {
  return {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    uid: user.uid,
  }
}

export const requestFollow = (fromUser: UserType, toUser: UserType): object => {
  return db.collection('relations').add({
    confirmed: false,
    fromUser: getUserFields(fromUser),
    fromUserId: fromUser.uid,
    toUser: getUserFields(toUser),
    toUserId: toUser.uid,
  })
}

export const deleteRequestFollow = async (id: string): Promise<void> => {
  log('delete relation: %s', id)

  return db
    .collection('relations')
    .doc(id)
    .delete()
    .then(() => {
      log('deleted: %s', id)
    })
    .catch(err => {
      log('failed to delete: %s', err)
      throw err
    })
}

export const confirmFollow = async (id: string): Promise<void> => {
  return db
    .collection('relations')
    .doc(id)
    .update({ confirmed: true })
}

export interface RecipeOptions {
  author: string
  createdBy?: {
    email: string
    photoURL: string
  }
  description: string
  image?: string
  ingredients: any
  plain: string
  title: string
  userId: string
}

export const createEntry = async (options: RecipeOptions): Promise<any> => {
  log('save recipe: %o', options)

  return db.collection('recipes').add({
    ...omitBy(options, isNil),
    updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
  })
}

interface RecipeUpdateOptions {
  author: string
  createdBy?: {
    email: string
    photoURL: string
  }
  description: string
  image?: string
  ingredients: any
  plain: string
  title: string
}

export const updateEntry = async (id: string, options: RecipeUpdateOptions): Promise<void> => {
  return db
    .collection('recipes')
    .doc(id)
    .update({
      ...omitBy(options, isNil),
      image: options.image || firebase.firestore.FieldValue.delete(),
    })
}

export const deleteEntry = async (id: string): Promise<void> => {
  log('delete: %s', id)

  return db
    .collection('recipes')
    .doc(id)
    .delete()
}
