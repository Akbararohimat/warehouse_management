"use client";

import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  return (
    <section className="flex h-full w-full flex-col justify-center px-16">
      <h1 className="text-4xl font-bold text-black">
        Login to your account
      </h1>

      <p className="mt-2 text-base text-gray-500">
        masukan email dan password anda
      </p>

      <form
        className="mt-10"
        onSubmit={(e) => {
          e.preventDefault();

          localStorage.setItem("isLoggedIn", "true");
          router.push("/dashboard");
        }}
      >

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
        </div>
          <input
            id="email"
            type="email"
            placeholder="Masukan email"
            className="h-12 w-full rounded-full bg-gray-200 px-5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        

        <div className="mt-6 flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Masukan Password"
            className="h-12 w-full rounded-full bg-gray-200 px-5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4"
          />

          <label
            htmlFor="remember"
            className="text-sm text-gray-600"
          >
            remember me
          </label>
        </div>

        
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="h-11 w-32 rounded-full bg-[#536DFE] text-sm font-medium text-black transition hover:opacity-90"
          >
            Login
          </button>
        </div>
      </form>
    </section>
  );
}