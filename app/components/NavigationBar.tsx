import Link from 'next/link';

export function NavigationBar() {
  return (
    <nav className="flex h-14 items-center bg-mid border-b-4 border-black px-6">
      <ul className="flex space-x-8 text-light">
        <li>
          <Link href="/" className="hover:text-cyan hover:shadow-led transition">
            Inicio
          </Link>
        </li>
        <li>
          <Link href="/catalog" className="hover:text-cyan hover:shadow-led transition">
            Catálogo
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-cyan hover:shadow-led transition">
            Acerca
          </Link>
        </li>
      </ul>
    </nav>
  );
}
