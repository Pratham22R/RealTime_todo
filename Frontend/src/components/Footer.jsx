import React from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-gray-900">
              <span className="text-2xl">📝</span>
              <span className="text-lg font-bold">Teamlens</span>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              The collaborative work OS for high-velocity product teams.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/dashboard" className="hover:text-gray-900">Dashboard</Link></li>
              <li><Link to="/board" className="hover:text-gray-900">Board</Link></li>
              <li><a href="#" className="hover:text-gray-900">Templates</a></li>
              <li><a href="#" className="hover:text-gray-900">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">About</a></li>
              <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="hover:text-gray-900">Security</a></li>
              <li><a href="#" className="hover:text-gray-900">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Stay in the loop</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks! We'll be in touch.");
              }}
              className="flex gap-2"
            >
              <div className="relative w-full">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                Subscribe
              </button>
            </form>

            <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
              <span>© {new Date().getFullYear()} Teamlens</span>
              <span>•</span>
              <a href="#" className="hover:text-gray-700">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
