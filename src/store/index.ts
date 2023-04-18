
import {configureStore} from '@reduxjs/toolkit'
import {contactsApi} from '../api/contactsApi'

const {
  reducerPath: contactsReducerPath,
  reducer: contactsReducer,
  middleware: contactsMiddleware
} = contactsApi

export default configureStore({
  reducer: {
    [contactsReducerPath]: contactsReducer
  },
  middleware: defaultMiddleware => defaultMiddleware().concat(contactsMiddleware)
})