

import React from 'react'

import {
  // Caches fetched data in store
  // Reusable in many components (one network-request in all usages(subscriptions))
  // Refetch/Invalidation in one component - update in all usages(subscriptions) (for same hook & same params)
  // Data will remain in the cache for keepUnusedDataFor(=60) seconds if no usages(subscriptions)
  useContactsQuery,
  useContactQuery,
  useAddContactMutation,
  useDeleteContactMutation,
  useUpdateContactMutation
} from './api/contactsApi'

const randomNumericString = () => String(Math.random()).split('.')[1]
const randomName = () => 'Stephen' + randomNumericString()

const performMutation = async <T = void>(promise: Promise<T>) => {
  try {
    const payload = await promise
    console.log(payload)
    return payload
  }
  catch (error) {
    console.error(error)
  }
}
// Alternatively <Contact> could use the useContactsQuery() with right todo object
// without need to cache contact(id)
const Contact: React.FunctionComponent<{id: string}> = ({id}) => {
  const {data} = useContactQuery(id)
  const [deleteContact] = useDeleteContactMutation()
  const [updateContact] = useUpdateContactMutation()

  const deleteHandler = async (event: React.MouseEvent) => await performMutation<void>(deleteContact(id).unwrap())

  const updateHandler = async (event: React.MouseEvent) => await performMutation(updateContact({
    id,
    name: randomName()
    })
    .unwrap()
  )

  return <>
    <span>{data ? JSON.stringify(data) : 'loading contact'}</span>
    <span onClick={deleteHandler}>[delete]</span>
    <span onClick={updateHandler}>[update]</span>
  </>
}

const AddContact: React.FunctionComponent<{}> = () => {
  const [addContact] = useAddContactMutation()

  const addHandler = async (event: React.MouseEvent) => await performMutation(addContact({
    id: randomNumericString(),
    name: randomName(),
    email: 'st.n@gmail.com'
  })
  .unwrap())

  return <button onClick={addHandler}>+contact</button>
}

export const App: React.FunctionComponent<{text: string}> = ({text}) => {
  const {data = [], isLoading, isError, isFetching, isSuccess, refetch} = useContactsQuery()
  let contacts = undefined

  if (isSuccess) {
    contacts = data.map(contact => <div key={contact.id}><b>User {contact.id} {contact.name}</b>: <Contact id={contact.id} /></div>)
  }

  return (
    <div>
      <h1>
        {text}
      </h1>
      <div>
        {isLoading && <div>[Loading]</div>}
        {isFetching && <div>[Fetching]</div>}
        {isError && <div>[Request failed]</div>}
        {isSuccess && contacts}
      </div>
      <div>
        <AddContact />
      </div>
    </div>
  )
}