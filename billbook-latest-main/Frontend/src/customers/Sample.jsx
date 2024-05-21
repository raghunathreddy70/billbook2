import React from 'react'

const Sample = ({match}) => {
  return (
    <div>Sample:{match.params.name}</div>
  )
}

export default Sample