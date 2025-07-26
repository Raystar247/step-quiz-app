import './App.css'
import SignInPage from './features/users/components/SignInPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './stores'
import UserMain from './features/users/components/Main'
import SignUpPage from './features/users/components/SignUpPage'
import QuestionMain from './features/stepq/components/QuestionMain'

function App() {

  return (
    <>
    <div className='flex justify-center items-center mt-10'>
      <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/user" element={<UserMain />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/step" element={<QuestionMain />} />
        </Routes>
      </BrowserRouter>
      </Provider>
    </div>
    </>
  )
}

export default App