import './App.css'
import SignInPage from './features/users/components/SignInPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store, { persistor } from './stores'
import UserMain from './features/users/components/Main'
import SignUpPage from './features/users/components/SignUpPage'
import TrialSetting from './features/stepq/components/TrialSetting'
import StepqMain from './features/stepq/components/Main'
import QuestionEnd from './features/stepq/components/QuestionEnd'
import ScoringPage from './features/stepq/components/ScoringPage'
import App0 from './features/stepq/components/a'
import { PersistGate } from 'redux-persist/integration/react'

function App() {

  return (
    <>
    <div className='flex justify-center items-center mt-10'>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Routes>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/user" element={<UserMain />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path='/setting_' element={<TrialSetting />} />
              <Route path='/stepq/:id' element={<StepqMain />} />
              <Route path='/stepq/end' element={<QuestionEnd />} />
              <Route path='/scoring/:qgroupId' element={<ScoringPage />} />
              <Route path='/sample' element=<App0 /> />
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </div>
    </>
  )
}

export default App