import React from 'react'
import ActionManager from '../components/header/ActionManager'
import InvoicesDisplay from '../components/InvoicesDisplay'

function Dashboard() {
  return (
    <div className="pt-[77px]">
        <ActionManager />

      <div className="mt-16 w-full ">
        <InvoicesDisplay />
      </div>
    </div>

  )
}

export default Dashboard