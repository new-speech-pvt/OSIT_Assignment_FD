import React from 'react'
import AssignmentForm2 from './assignment/pages/AssignmentForm2'
import OsitAssignmentProvider from './assignment/pages/OsitAssignmentProvider'
import AssignmentForm from './assignment/pages/AssignmentForm'  

import MyEditor from './assignment/Components/FormD/TextEditor'

const App = () => {
  return (
    <>
    <OsitAssignmentProvider>
       <AssignmentForm2 />
  </OsitAssignmentProvider>
{/* <MyEditor/>  */}
</>
  )
}

export default App
