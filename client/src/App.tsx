import "./App.css";
import Header from './components/header/Navbar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { UserProvider } from "../context/UserContext";
import { PhotoProvider } from "../context/PhotoContext";
import { AuthProvider } from "../context/AuthContext";

function App() {
console.log("ENV TEST →", import.meta.env.VITE_API_URL);
  return (
    <>
    <UserProvider>
      <AuthProvider>
        <PhotoProvider>
          <Header />
          <main >
            <Outlet />
          </main>
          <Footer />
        </PhotoProvider>
      </AuthProvider>
    </UserProvider>
    </>
  );
}

export default App;
