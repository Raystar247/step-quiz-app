import './App.css'
import SignInPage from './features/users/components/SignInPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './stores'
import UserMain from './features/users/components/Main'
import SignUpPage from './features/users/components/SignUpPage'
import Timer from './features/stepq/components/Timer'

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
        </Routes>
      </BrowserRouter>
      </Provider>
    </div>
    </>
  )
}

export default App