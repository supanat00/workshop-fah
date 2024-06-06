"use client"

import "./app.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Script from "./script";
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
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8 col-10 mt-5">
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Sign Up</h3>
                <form>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Enter your username"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary" onClick={handleSignup}>
                      Login
                    </button>
                  </div>
                  <div className="mt-3 text-center">
                    <p>
                      Have account ready? <a href="/signin">Sign in</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Script />
    </>
  );
}
