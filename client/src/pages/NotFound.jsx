import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white grid place-items-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-zinc-400">The page you requested does not exist.</p>
        <Link to="/" className="mt-6 inline-block rounded-2xl bg-white text-black px-5 py-2.5 text-sm font-semibold">
          Go home
        </Link>
      </div>
    </div>
  );
}
