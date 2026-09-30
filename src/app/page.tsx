import LoginImage from "@/components/login/LoginImage";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full bg-white">
      <LoginImage />

      <LoginForm />
    </main>
  );
}