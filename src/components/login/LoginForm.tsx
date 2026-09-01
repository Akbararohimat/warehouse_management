"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Email atau password salah");
        return;
      }

      if (remember) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex h-full w-full flex-col justify-center px-16">
      <h1 className="text-4xl font-bold text-black">
        Login to your account
      </h1>

      <p className="mt-2 text-base text-gray-500">
        masukan email dan password anda
      </p>

      <form className="mt-10" onSubmit={handleLogin}>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Masukan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 w-full rounded-full bg-gray-200 px-5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 w-full rounded-full bg-gray-200 px-5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4"
          />

          <label
            htmlFor="remember"
            className="text-sm text-gray-600"
          >
            remember me
          </label>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-32 rounded-full bg-[#536DFE] text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </div>
      </form>
    </section>
  );
}