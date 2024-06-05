"use client"

import Link from "next/link";
import { useSession, signOut } from 'next-auth/react'
import Swal from "sweetalert2";

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/home">
            WorkShop
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" href="/home">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {session ? (
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {session.user.name}
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" href="#">
                        Profile
                      </Link>
                    </li>
                    {session.user.role === 'admin' && (
                      <li>
                        <Link className="dropdown-item" href="/dashboard">
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => {
                        Swal.fire({
                          title: "Sign Out",
                          text: "Are you sure you want to sign out?",
                          icon: "question",
                          showCancelButton: true,
                          confirmButtonText: "Sign Out",
                        }).then((willSignOut) => {
                          if (willSignOut.isConfirmed) {
                            signOut({ callbackUrl: "/home" });
                          }
                        });
                      }}>
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="btn btn-primary" href='/signin'>
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
