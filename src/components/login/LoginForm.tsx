"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Email atau password salah"
        );
        return;
      }

      if (remember) {
        localStorage.setItem(
          "authToken",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      } else {
        sessionStorage.setItem(
          "authToken",
          data.token
        );

        sessionStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      if (data.user.role === "ADMIN") {
        router.push("/dashboard");
        return;
      }

      if (data.user.division === "SALES") {
        router.push("/sales");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "Tidak dapat terhubung ke server"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-white px-8 py-10 lg:w-1/2 lg:px-16">
      <div className="w-full max-w-xl">

        <div className="mb-8">

          <div className="flex items-start gap-5">

            <div
              className="
                animate-login-line
                mt-1
                h-24
                w-1.5
                shrink-0
                rounded-full
                bg-yellow-500
              "
            />

            <div>
              <h1
                className="
                  animate-login-title
                  text-5xl
                  font-bold
                  tracking-tight
                  text-[#010736]
                "
              >
                Dashboard RND
              </h1>
              <p
                className="
                  animate-login-subtitle
                  mt-1
                  text-2xl
                  font-medium
                  text-[#010736]
                "
              >
                Research and Development
              </p>

            </div>

          </div>
          <p
            className="
              animate-login-description
              mt-6
              max-w-md
              text-base
              leading-6
              text-[#24395f]
            "
          >
            Akses dashboard untuk melihat
            data product, vendor, kontak
            vendor dan solusi.
          </p>

        </div>
        <form
          onSubmit={handleLogin}
          className="mt-8"
        >
          <div className="flex flex-col gap-2">

            <label
              htmlFor="email"
              className="text-sm font-medium text-[#24395f]"
            >
              Email
            </label>

            <div className="relative">

              <Mail
                size={19}
                className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-[#6d7f9f]
                "
              />

              <input
                id="email"
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="
                  h-13
                  w-full
                  rounded-full
                  border
                  border-[#d9e0eb]
                  bg-white
                  pl-14
                  pr-5
                  text-sm
                  text-[#010736]
                  outline-none
                  transition
                  focus:border-[#536DFE]
                  focus:ring-2
                  focus:ring-[#536DFE]/10
                  placeholder:text-[#8b9ab5]
                "
              />

            </div>

          </div>
          <div className="mt-6 flex flex-col gap-2">

            <label
              htmlFor="password"
              className="text-sm font-medium text-[#24395f]"
            >
              Password
            </label>

            <div className="relative">

              <LockKeyhole
                size={19}
                className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-[#6d7f9f]
                "
              />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="
                  h-13
                  w-full
                  rounded-full
                  border
                  border-[#d9e0eb]
                  bg-white
                  pl-14
                  pr-14
                  text-sm
                  text-[#010736]
                  outline-none
                  transition
                  focus:border-[#536DFE]
                  focus:ring-2
                  focus:ring-[#536DFE]/10
                  placeholder:text-[#8b9ab5]
                "
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-[#6d7f9f]
                  transition
                  hover:text-[#010736]
                "
                aria-label={
                  showPassword
                    ? "Sembunyikan password"
                    : "Tampilkan password"
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>

          </div>

          <div className="mt-5 flex items-center gap-2.5">

            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(
                  e.target.checked
                )
              }
              className="
                h-4
                w-4
                cursor-pointer
                rounded
                border-[#9aa8bd]
                accent-[#536DFE]
              "
            />

            <label
              htmlFor="remember"
              className="
                cursor-pointer
                text-sm
                text-[#435575]
              "
            >
              Remember Me
            </label>

          </div>

          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="mt-7">

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                h-13
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#3f5ee8]
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#3452dc]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <span>
                    Login
                  </span>

                  <ArrowRight
                    size={18}
                  />
                </>
              )}
            </button>

          </div>

        </form>

      </div>
    </section>
  );
}