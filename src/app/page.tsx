import { db } from "@/db";
import { sql } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await db.execute(sql`select 1`);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="mb-8 inline-block rounded-full bg-blue-100 px-4 py-2">
            <span className="text-sm font-semibold text-blue-700">Blender Add-on Converter</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
            Convert Blender 2.79b Add-ons to 2.80-4.1
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
            A comprehensive tool to help you migrate your Blender Python add-ons from legacy versions 
            to modern Blender 2.80, 3.x, and 4.x APIs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/converter" 
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Try Converter
            </Link>
            <Link 
              href="/api-changes" 
              className="rounded-lg border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 hover:bg-blue-50"
            >
              View API Changes
            </Link>
            <Link 
              href="/examples" 
              className="rounded-lg border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              See Examples
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Code Converter</h3>
              <p className="text-gray-600">
                Upload your 2.79b add-on code and get automatic suggestions for converting to newer Blender versions.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 inline-block rounded-lg bg-green-100 p-3">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">API Reference</h3>
              <p className="text-gray-600">
                Comprehensive documentation of API changes between Blender versions with code examples.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 inline-block rounded-lg bg-purple-100 p-3">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Examples Library</h3>
              <p className="text-gray-600">
                Browse real conversion examples and learn best practices for migrating your add-ons.
              </p>
            </div>
          </div>
        </section>

        {/* Version Support */}
        <section className="mb-16 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">Supported Versions</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {['2.79b', '2.80', '2.90', '3.0', '3.6', '4.0', '4.1'].map((version) => (
              <div key={version} className="rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{version}</div>
                <div className="text-sm text-gray-500">
                  {version === '2.79b' ? 'Legacy' : version.startsWith('2.') ? 'Transition' : 'Modern'}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Start */}
        <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-white">
          <h2 className="mb-4 text-3xl font-bold">Get Started in 3 Steps</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold">Upload Code</h3>
              <p>Paste your 2.79b add-on code or upload the .py file</p>
            </div>
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold">Select Target</h3>
              <p>Choose which Blender version you want to convert to</p>
            </div>
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold">Get Conversion</h3>
              <p>Receive converted code with explanations for each change</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link 
              href="/converter" 
              className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-gray-100"
            >
              Start Converting Now
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
