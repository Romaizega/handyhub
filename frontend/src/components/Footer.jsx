import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-neutral-content text-neutral py-12 mt-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-bold mb-3">HandyHub</h2>
            <p className="text-sm opacity-80 mb-4">
              Connecting clients with local professionals for repairs, improvements, and more.
            </p>
            <div className="flex gap-4 text-xl">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* SUPPORT */}
          <div>
            <h6 className="text-lg font-semibold mb-3">Support</h6>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h6 className="text-lg font-semibold mb-3">Company</h6>
            <p className="text-sm opacity-80">Tel Aviv, Israel</p>
            <p className="text-sm opacity-80">support@handyhub.com</p>
          </div>
        </div>

        {/* BOTTOM LINE */}
        <div className="mt-10 border-t border-base-300 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} HandyHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
