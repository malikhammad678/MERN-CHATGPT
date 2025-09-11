import Sidebar from './components/Sidebar'
import Chatbox from './components/Chatbox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import Login from './pages/Login'
import { useAppContext } from './context/Appcontext'

const App = () => {
  const { user } = useAppContext()
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const { pathname } = useLocation()

  if (pathname === '/loading') return <Loading />

  return (
    <>
      {!isOpenMenu && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsOpenMenu(true)}
          alt=""
        />
      )}

      <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
        {user ? (
          <div className="flex h-screen w-screen">
            <Sidebar isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} />
            <Routes>
              <Route path="/" element={<Chatbox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        ) : (
          <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'>
            <Login />
          </div>
        )}
      </div>
    </>
  )
}

export default App
