"use client";
import { auth_service, useAppData } from '@/context/AppContext';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from 'next/link';
import React, { FormEvent, useState } from 'react'
import toast from 'react-hot-toast';
import Cookies from 'js-cookie'


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const router = useRouter();
  const { isAuth, setUser, loading, setIsAuth } = useAppData();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${auth_service}/api/auth/login`,
        {
          email,
          password,
        }
      );

      toast.success(data.message);
      Cookies.set("token", data.token, {
        expires: 15,
        secure: true,
        path: '/',
      });
      setUser(data.userObject);
      setIsAuth(true);
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  };

  // if (loading) return null;
  // if (isAuth) return redirect("/");
useEffect(() => {
  if (isAuth) {
    router.replace("/");
  }
}, [isAuth, router]);

if (loading) {
  return <div>Loading...</div>;
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={btnLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {btnLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage