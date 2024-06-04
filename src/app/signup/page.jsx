"use client"

import "./app.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Script from "next/script";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";

export default function Page() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { data: session } = useSession()

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const newUser = await axios.post('/api/auth/signup', {
        name,
        email,
        password
      })
      if (newUser.data.message === "success") {
        Swal.fire({
          title: "success",
          text: "sign up successfully",
          icon: "success",
          timer: 1000
        })
        router.push('/signin')
      }
    } catch(err) {
      Swal.fire({
        title: "error",
        text: err.message,
        icon: "error"
      })
    }
  }

  if (session) {
    router.push('/')
    return null
  }

  return (
    <>
      <div className="hold-transition register-page">
        <div className="register-box">
          <div className="register-logo">
            <Link href="/signup">
              <b>Sign Up</b>
            </Link>
          </div>
          <div className="card">
            <div className="card-body register-card-body">
              <p className="login-box-msg">Register a new membership</p>
              <form onSubmit={handleSignup}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user" />
                    </div>
                  </div>
                </div>
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
                  <div className="col-4 mb-3">
                    <button type="submit" className="btn btn-primary btn-block">
                      Register
                    </button>
                  </div>
                  {/* /.col */}
                </div>
              </form>
              <Link href="/signin" className="text-center">
                I already have a membership
              </Link>
            </div>
            {/* /.form-box */}
          </div>
          {/* /.card */}
        </div>
        {/* /.register-box */}
      </div>

      <Script src="/plugins/jquery/jquery.min.js"></Script>
      <Script src="/plugins/bootstrap/js/bootstrap.bundle.min.js"></Script>
      <Script src="/dist/js/adminlte.js"></Script>
    </>
  );
}
