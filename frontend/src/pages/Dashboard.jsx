import React from 'react'
import ActionManager from '../components/header/ActionManager'
import InvoicesDisplay from '../components/InvoicesDisplay'

function Dashboard() {
  return (
    <div className="pt-[104px] sm:pt-[141px] pb-12 lg:pt-[77px]">
        <ActionManager />

      <div className="mt-8 sm:mt-[55px] lg:mt-16 w-full">
        <InvoicesDisplay />
      </div>
    </div>

  )
}

export default Dashboard