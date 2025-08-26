export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-6 w-full">        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">EduAcademy</h3>
            <p className="text-sm leading-6">
              EduAcademy is dedicated to providing world-class education for JEE, NEET, and Foundation students. 
              With expert mentors and innovative teaching methods, we ensure academic success and holistic growth.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Courses</a></li>
              <li><a href="#" className="hover:text-white">Admissions</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
  
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <p className="text-sm">📍 123 Learning Street, Knowledge City, India</p>
            <p className="text-sm">📞 +91 98765 43210</p>
            <p className="text-sm">✉️ info@eduacademy.com</p>
          </div>
  
          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">🌐</a>
              <a href="#" className="hover:text-white">📘</a>
              <a href="#" className="hover:text-white">🐦</a>
              <a href="#" className="hover:text-white">📸</a>
            </div>
          </div>
        </div>
  
        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} EduAcademy. All rights reserved.
        </div>
      </footer>
    );
  }
  