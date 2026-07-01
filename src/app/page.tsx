"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useAuth";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@outofoffice.com");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password }, {
      onSuccess: (data) => {
        if (data.success) {
          router.push("/dashboard");
        }
      }
    });
  };

  const isLoading = loginMutation.isPending;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[url('/images/onboarding.jpg')] bg-cover bg-center">
      <div className="mb-4">
        <Image
          src="/images/logo.png"
          alt="Out of Office Logo"
          width={120}
          height={40}
          priority
        />
      </div>

      {/* Container Card */}
      <div className="w-full max-w-120 min-h-95 bg-white rounded-[24px] shadow-lg p-8 sm:p-10 flex flex-col items-center justify-center">
        {isLoading ? (
          <Image 
            src="/gif/loading-animation.gif" 
            alt="Loading..." 
            width={200} 
            height={200} 
            unoptimized 
          />
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Heading */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-1 w-full">
              Welcome Admin
            </h1>
            <p className="text-sm text-[#565F73] mb-8 w-full">
              Provide your login details below
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              {/* Email Input */}
              <div className="relative w-full">
                <label className="absolute -top-2 left-6 bg-white px-1 text-[11px] font-medium text-gray-700 z-10">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="admin@outofoffice.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-text-950 px-6 py-3.5 text-sm text-gray-900 placeholder:text-gray-900 outline-none focus:border-[#5C00FF] focus:ring-1 focus:ring-[#5C00FF] transition-all bg-transparent"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative w-full">
                <label className="absolute -top-2 left-6 bg-white px-1 text-[11px] font-medium text-gray-700 z-10">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="xxxxxxxx"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full border border-text-950 px-6 py-3.5 text-sm text-gray-900 placeholder:text-gray-900 outline-none focus:border-[#5C00FF] focus:ring-1 focus:ring-[#5C00FF] transition-all bg-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-[#5C00FF] hover:bg-[#00CC8D] hover:text-text-950 text-white py-7 mt-5 text-sm font-semibold transition-all disabled:opacity-50"
              >
                Submit
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
