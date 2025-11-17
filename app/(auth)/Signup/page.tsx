import { SignUpForm } from "@/components/auth/SignupForm";

export default function SignUpPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
        <p className="text-gray-400">
          Join thousands of artists creating with AI
        </p>
      </div>
      <SignUpForm />
    </>
  );
}
