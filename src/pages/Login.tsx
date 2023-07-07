import { auth, provider } from "../config/firebase";
import { browserLocalPersistence, setPersistence, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'


interface LoginProps {
  setIsAuth: (isAuth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuth }) => {
    const navigate = useNavigate()
    
    const signInWithGoogle = () => {
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            signInWithPopup(auth, provider)
              .then((result) => {
                const name: any = result.user.displayName;
                const email: any = result.user.email;
                const profilePic: any = result.user.photoURL;
      
                localStorage.setItem("name", name);
                localStorage.setItem("email", email);
                localStorage.setItem("profilePic", profilePic);

                localStorage.setItem("isAuth", "true");
                setIsAuth(true);
                navigate("/")
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      };
      

    return (
        <div className="text-white p-2 flex justify-center items-center flex-col gap-3 h-96">
            <p>Sign In With Google to Continue</p>
            <button className="p-2 border-4 rounded-xl border-white" onClick={signInWithGoogle}>Sign In With Google</button>
        </div>
    )
  }
  
  export default Login