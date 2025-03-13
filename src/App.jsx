
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
import { Loader } from 'lucide-react';

export default function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <>

      <Header />
      <Sidebar />
      <Routes>
        <Route path='/' element={<Acceuil />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/dashboard/user"} />} />
        <Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to={"/login"} />} />
        <Route path='/dashboard/user' element={authUser ? <Page /> : <Navigate to={"/login"} />} />
        <Route path="/articles/new" element={authUser ? <AddArticle /> : <Navigate to={"/login"} />} />
        <Route path="/articles/:id/edit" element={authUser ? <EditArticle /> : <Navigate to={"/login"} />} />
      </Routes>
    </>

  );
}