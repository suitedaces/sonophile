import Background from '../components/login/Background';
import LoginContent from '../components/login/LoginContent';

const Login = () => {
  return (
    <div className="App h-screen w-screen overflow-hidden relative">
          
    {/* Background */}
      <div className="absolute top-0 left-0 h-full w-full z-0">
        <Background />
      </div>
    
    {/* Login */}
      <div className="relative z-10 h-full w-full">
        <LoginContent />
      </div>
    </div>
  );
}

export default Login;