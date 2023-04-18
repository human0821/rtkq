
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {Contact} from '../types'

export const contactsApi = createApi({
  reducerPath: 'contactsApi',
  tagTypes: ['Contacts'],
  keepUnusedDataFor: 5,
  baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3004'}),
  endpoints: build => ({
    contacts: build.query<Contact[], void>({
      query: () => '/contacts',
      providesTags: [{type: 'Contacts', id: 'LIST'}]
    }),
    contact: build.query<Contact, string>({
      query: id => '/contacts/' + id,
      providesTags: (result, error, id) => [{type: 'Contacts', id}]
    }),
    addContact: build.mutation<Contact, Contact>({
      query: contact => ({
        url: '/contacts',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: contact
      }),
      // could be re-cached using manual cache update without need to re-fetching whole list again
      invalidatesTags: [{type: 'Contacts', id: 'LIST'}]
    }),
    updateContact: build.mutation<Pick<Contact, 'id'> & Pick<Contact, 'name'>, Pick<Contact, 'id'> & Partial<Contact>>({
      query: ({id, ...rest}) => ({
        url: '/contacts/' + id,
        method: 'PUT',
        body: rest
      }),
      // in cached contacts(undefined) list updating one item rather than re-fetching the whole list
      // using manual cache update (pessimistic)
      // https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#pessimistic-updates
      onQueryStarted: async ({id}, api) => {
        try {
          const {data} = await api.queryFulfilled
          api.dispatch(contactsApi.util.updateQueryData('contacts', undefined, draft => {
            draft.forEach(contact => {
              if (contact.id === id) {
                Object.assign(contact, data)
              }
            })
          }))
        } catch {}
      },
      // cached contact(id) is re-cached by re-fetching using tag
      // but could also be re-cached using manual cache update
      // https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
      invalidatesTags: (result, error, {id}) => [{type: 'Contacts', id}]
    }),

    deleteContact: build.mutation<void, string>({
      query: id => ({
        url: '/contacts/' + id,
        method: 'DELETE'
      }),
      // could be re-cached using manual cache update without need to re-fetching whole list again
      invalidatesTags: (result, error, id) => [{type: 'Contacts', id: 'LIST'}]
    })
  })
})

export const {
  useContactsQuery,
  useContactQuery,
  useDeleteContactMutation,
  useUpdateContactMutation,
  useAddContactMutation
} = contactsApi