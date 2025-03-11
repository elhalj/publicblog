
import { Navigate, Route, Routes } from 'react-router-dom';
import Acceuil from './pages/Acceuil';
import Header from './components/Header';
import Sidebar from './components/Navigation/Sidebar';
import AddArticle from './components/users/forms/AddArticle';
import EditArticle from './components/users/forms/EditArticle';
import Page from './pages/Dashbord/Page';
import Login from './pages/connecxion/Login';
import SignUp from './pages/connecxion/SignUp';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';

export default function App() {
  const { checkAuth, authUser } = useAuthStore()

  useEffect(() => {
    checkAuth();
  }, [])

  console.log(authUser)

  return (
    <>

      <Header />
      <Sidebar />
      <Routes>
        <Route path='/' element={<Acceuil />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/dashboard/user" replace />} />
        <Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to="/login" replace />} />
        <Route path='/dashboard/user' element={authUser ? <Page /> : <Navigate to="/login" replace />} />
        <Route path="/articles/new" element={authUser ? <AddArticle /> : <Navigate to="/login" replace />} />
        <Route path="/articles/:id/edit" element={authUser ? <EditArticle /> : <Navigate to="/login" replace />} />
      </Routes>
    </>

  );
}