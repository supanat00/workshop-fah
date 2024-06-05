"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import axios from "axios";

export default function Sidebar() {
  const [productCount, setProductCount] = useState(0);
  const [billSaleCount, setBiilSaleCount] = useState(0)
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [router, status]);

  useEffect(() => {
    fetchProductCount();
    fetchBillSaleCount();
  }, []);

  const fetchProductCount = async () => {
    try {
      const res = await axios.get("/api/product/count", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setProductCount(res.data.count);
    } catch (err) {
      Swal.fire({
        title: "error",
        text: err.message,
        icon: "error",
      });
    }
  };

  const fetchBillSaleCount = async () => {
    try {
      const res = await axios.get('/api/sale/count', {
        headers: { "Content-Type": "application/json" }
      })
      if (res.data.count !== undefined) {
        setBiilSaleCount(res.data.count)
      }
    } catch (err) {
      Swal.fire({
        title: 'error',
        text: err.message,
        icon: 'error'
      })
    }
  }

  return (
    status === "authenticated" &&
    session.user && (
      <>
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
          <Link href="/dashboard" className="brand-link">
            <img
              src="/dist/img/AdminLTELogo.png"
              alt="AdminLTE Logo"
              className="brand-image img-circle elevation-3"
              style={{ opacity: ".8" }}
            />

            <span className="brand-text font-weight-light">Admin Panel</span>
          </Link>
          <div className="sidebar">
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="image">
                <img
                  src="/dist/img/user2-160x160.jpg"
                  className="img-circle elevation-2"
                  alt="User Image"
                />
              </div>
              <div className="info">
                <a href="#" className="d-block">
                  {session.user.name}
                </a>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: "Sign Out",
                      text: "Are you sure you want to sign out?",
                      icon: "question",
                      buttons: ["Cancel", "Sign Out"],
                      dangerMode: true,
                    }).then((willSignOut) => {
                      if (willSignOut) {
                        signOut({ callbackUrl: "/signin" });
                      }
                    });
                  }}
                  className="btn btn-danger m-3"
                >
                  <i className="fa fa-times mr-2"></i> Sign Out
                </button>
              </div>
            </div>
            <div className="form-inline">
              <div className="input-group" data-widget="sidebar-search">
                <input
                  className="form-control form-control-sidebar"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <div className="input-group-append">
                  <button className="btn btn-sidebar">
                    <i className="fas fa-search fa-fw" />
                  </button>
                </div>
              </div>
            </div>
            <nav className="mt-2">
              <ul
                className="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                <li className="nav-header">Menu</li>
                <li className="nav-item">
                  <Link href="/dashboard/product" className="nav-link">
                    <i className="nav-icon fa fa-box" />
                    <p>
                      สินค้า
                      <span className="badge badge-info right">
                        {productCount}
                      </span>
                    </p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard/billSale" className="nav-link">
                    <i className="nav-icon fa fa-list" />
                    <p>
                      รายงานยอดขาย
                      <span className="badge badge-info right">
                        {billSaleCount}
                      </span>
                    </p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard/user" className="nav-link">
                    <i className="nav-icon fa fa-user" aria-hidden="true"></i>
                    <p>จัดการผู้ใช้</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
      </>
    )
  );
}
