import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import { useState } from 'react';
import { signOut } from 'firebase/auth'
import { auth } from './config/firebase';
import PostPage from './pages/PostPage';
import './index.css' 


const App: React.FC = () => {

  const [isAuth, setIsAuth] = useState(false);

  const userSignOut = () => {
    signOut(auth).then(() => {
      localStorage.clear()
      setIsAuth(false);
      window.location.pathname= "/home";
    })
  };

  return (
    <Router>
      <nav className='bg-black text-white p-4 flex justify-center items-center gap-5 text-lg font-bold'>
        <Link className=' transition-all duration-200 hover:text-orange-400' to='/'>Home</Link>
        {!isAuth ? ( 
        <Link className=' transition-all duration-200 hover:text-orange-400' to='/login'>Login</Link> 
        ) : ( 
          <>
            <Link className='transition-all duration-200 hover:text-orange-400' to="/createpost">Create Post</Link>
            <button onClick={userSignOut}> Log Out</button> 
          </>
        )} 
      
      </nav>
      <Routes>
        <Route path="/" element={<Home isAuth={false}/>} />
        <Route path="/post/:id" element={<PostPage postId={""} />} />
        <Route path="/" element={<Home isAuth={false}/>} />
        <Route path="/createpost" element={<CreatePost isAuth={isAuth} />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
      </Routes>
    </Router>
  )
};

export default App
