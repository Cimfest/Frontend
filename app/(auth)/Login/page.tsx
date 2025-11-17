import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        <p className="text-gray-400">Sign in to your studio workspace</p>
      </div>
      <LoginForm />
    </>
  );
}
