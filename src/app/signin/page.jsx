"use client"

import './app.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from "next-auth/react";
import Swal from "sweetalert2";
import Script from 'next/script';
import Link from 'next/link';

export default function Page() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { data: session } = useSession()

  const handleSignin = async (e) => {
    e.preventDefault()
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password
      })
      if (res.error) {
        Swal.fire({
          title: 'error',
          text: res.error,
          icon: 'error'
        })
        return false
      }
      Swal.fire({
        title: 'success',
        text: 'Sign in successfully',
        icon: 'success',
        timer: 1000
      })
      router.push('/home')
    } catch (err) {
      Swal.fire({
        title: 'error',
        text: err.message,
        icon: 'error'
      })
    }
  }

  if (session) {
    router.push('/')
    return null
  }

  return (
    <>
      <div className="hold-transition login-page">
        <div className="login-box">
          <div className="login-logo">
            <Link href="/signin">
              <b>Sign In</b> to WorkShop
            </Link>
          </div>
          {/* /.login-logo */}
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Sign in to start your session</p>
              <form onSubmit={handleSignin}>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-envelope" />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* /.col */}
                  <div className="col-4">
                    <button type="submit" className="btn btn-primary btn-block">
                      Sign In
                    </button>
                  </div>
                  {/* /.col */}
                </div>
              </form>
              <p className="mt-4">
                <Link href="/signup" className="text-center">
                  Register a new membership
                </Link>
              </p>
            </div>
            {/* /.login-card-body */}
          </div>
        </div>
        {/* /.login-box */}
      </div>
      <Script src="/plugins/jquery/jquery.min.js"></Script>
      <Script src="/plugins/bootstrap/js/bootstrap.bundle.min.js"></Script>
      <Script src="/dist/js/adminlte.js"></Script>
    </>
  );
}
