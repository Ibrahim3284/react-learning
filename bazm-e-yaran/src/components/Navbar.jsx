import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import "./Navbar.css"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Alumni Portal", path: "/alumniLogin" },
    { name: "Results", path: "#" },
    {
      name: "Contact Us",
      action: () => {
        window.open(
          "https://mail.google.com/mail/?view=cm&fs=1&to=xyz@gmail.com&su=Hello%20ArrowAcademy&body=I%20want%20to%20contact%20you",
          "_blank"
        )
      },
    },
    { name: "Admin Portal", path: "/loginForm" },
  ]

  return (
    <>
      <nav
        className={`fixed w-full z-[1001] transition-all duration-500 backdrop-blur-lg h-[7vh] bg-[#1c1c1c]`}
      >
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 tracking-tight"
          >
            Bazm-e-<span className="text-white">Yaran</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 font-medium text-white">
            {navLinks.map((link, index) =>
              link.path ? (
                <Link
                  key={index}
                  to={link.path}
                  className="hover:text-red-600 transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={link.action}
                  className="hover:text-red-600 transition-colors duration-300"
                >
                  {link.name}
                </button>
              )
            )}
            <Link
              to="/studentLogin"
              className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:opacity-90 transition duration-300 font-semibold"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-red-500 text-red-600 px-6 py-2 rounded-full hover:bg-red-600 hover:text-white transition duration-300 font-semibold"
            >
              Signup
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-800"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white/90 backdrop-blur-md shadow-xl rounded-b-2xl py-6 px-6 flex flex-col space-y-5 text-gray-700 font-medium md:hidden animate-fade-in">
            {navLinks.map((link, index) =>
              link.path ? (
                <Link
                  key={index}
                  to={link.path}
                  className="hover:text-red-600 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    link.action()
                    setIsMenuOpen(false)
                  }}
                  className="hover:text-red-600 transition-colors duration-300"
                >
                  {link.name}
                </button>
              )
            )}
            <Link
              to="/studentLogin"
              className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-full shadow-md text-center hover:opacity-90 transition duration-300 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-red-500 text-red-600 px-6 py-2 rounded-full text-center hover: hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-500 hover:text-white transition duration-300 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Signup
            </Link>
          </div>
        )}
      </nav>

      {/* Spacer to avoid content jump */}
      <div className="h-20"></div>
    </>
  )
}
