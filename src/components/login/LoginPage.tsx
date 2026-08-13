import LoginForm from "./LoginForm";
import LoginImage from "./LoginImage";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-[#d9d9d9] flex items-center justify-center">
      <div className="flex w-[850px] h-[490px] overflow-hidden rounded-lg bg-white">
        
        
        <div className="w-[380px] h-full shrink-0">
          <LoginImage />
        </div>


        <div className="w-[470px] h-full flex items-center justify-center bg-white">
          <LoginForm />
        </div>

      </div>
    </main>
  );
}