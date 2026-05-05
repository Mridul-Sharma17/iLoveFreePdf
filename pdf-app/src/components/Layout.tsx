
import { Outlet, Link } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <header className="border-b border-hairline p-6">
        <Link to="/" className="text-xl font-bold tracking-tight">iLoveFreePdf</Link>
      </header>
      <main className="flex-1 w-full max-w-5xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
