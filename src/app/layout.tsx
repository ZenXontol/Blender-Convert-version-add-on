import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blender Add-on Converter | 2.79b to 2.80-4.1",
  description: "Convert your Blender 2.79b add-ons to newer versions (2.80, 3.x, 4.x) with automatic code conversion and API change documentation.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                    <span className="text-lg font-bold text-white">B</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Blender Converter</span>
                </Link>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link href="/converter" className="text-gray-700 hover:text-blue-600">
                  Converter
                </Link>
                <Link href="/api-changes" className="text-gray-700 hover:text-blue-600">
                  API Changes
                </Link>
                <Link href="/examples" className="text-gray-700 hover:text-blue-600">
                  Examples
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <a
                  href="https://docs.blender.org/api/current/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-block rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                >
                  Blender API Docs
                </a>
              </div>
            </div>
          </div>
        </header>
        {children}
        <footer className="border-t border-gray-200 bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600">
                    <span className="text-sm font-bold text-white">B</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">Blender Add-on Converter</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Convert Blender 2.79b add-ons to 2.80, 3.x, and 4.x
                </p>
              </div>
              <div className="flex space-x-6">
                <a
                  href="https://www.blender.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Blender.org
                </a>
                <a
                  href="https://docs.blender.org/api/current/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  API Documentation
                </a>
                <a
                  href="https://blender.stackexchange.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Blender Stack Exchange
                </a>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8 text-center">
              <p className="text-sm text-gray-600">
                This tool is not affiliated with the Blender Foundation. Blender® is a registered trademark of the Blender Foundation.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Created to help the Blender community migrate add-ons to newer versions.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
