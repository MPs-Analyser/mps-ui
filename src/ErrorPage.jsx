import React from 'react'

export default function ErrorPage({ error }) {
  return (

  <div>
    ErrorPage
    <pre>{JSON.stringify(error)}</pre>
  </div>
    
  )
}
