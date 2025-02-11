"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <CheckCircle className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Organize Your Life with Todo App
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            A simple and elegant way to keep track of your tasks. Sign in to get started.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              <Link href="/auth/signin">
                Sign In
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/register">
                Register
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}