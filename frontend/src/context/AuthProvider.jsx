import { useEffect, useMemo, useState } from "react"
import { AuthContext } from "./auth-context"

const STORAGE_KEY = "successpool-demo-user"

const RECRUITER_ACCOUNTS = [
  {
    role: "recruiter",
    email: "aymane.el-ghouali@gmail.com",
    password: "12341234",
    fullName: "Aymane El Ghouali",
    jobTitle: "Talent Acquisition Manager",
    company: "Société Générale",
    isSubscribed: false,
  },
  {
    role: "recruiter",
    email: "el-ghouali.aymane@gmail.com",
    password: "12341234",
    fullName: "Aymane El Ghouali",
    jobTitle: "Senior Recruiter",
    company: "Société Générale",
    isSubscribed: true,
  },
]

function readStoredUser() {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    return storedValue ? JSON.parse(storedValue) : null
  } catch (error) {
    console.error("Unable to read auth demo user from storage", error)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const account = RECRUITER_ACCOUNTS.find((entry) => entry.email.toLowerCase() === normalizedEmail)

    if (!account || account.password !== password) {
      throw new Error("Identifiants incorrects. Utilisez les accès recruteur fournis par Success Pool.")
    }

    const { password: _password, ...safeAccount } = account
    setUser(safeAccount)
    return safeAccount
  }

  const logout = () => {
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      recruiterAccounts: RECRUITER_ACCOUNTS.map(({ password, ...account }) => ({
        ...account,
        password,
      })),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
