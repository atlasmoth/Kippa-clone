import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar">
      <nav>
        <div title="cashbook">
          <Link href="/account">
            <a>
              <i className="fas fa-file-invoice"></i>
            </a>
          </Link>
        </div>
        <div title="products">
          <Link href="/products">
            <a>
              <i className="fas fa-archive"></i>
            </a>
          </Link>
        </div>
        <div title="Customers">
          <Link href="/customers">
            <a>
              <i className="fas fa-users"></i>
            </a>
          </Link>
        </div>
        <div title="Logout">
          <a href="/api/auth/logout">
            <i className="fas fa-sign-out-alt"></i>
          </a>
        </div>
      </nav>
    </div>
  );
}
