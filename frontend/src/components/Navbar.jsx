import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-all"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">PingMe</h2>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Settings Button */}
            <Link
              to="/settings"
              className="btn btn-sm gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
            >
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser ? (
              <>
                {/* Profile Button */}
                <Link
                  to="/profile"
                  className="btn btn-sm gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Logout Button */}
                <button
                  className="btn btn-sm gap-2 bg-red-100 hover:bg-red-200 text-red-700 transition-all"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-sm bg-primary hover:bg-primary/80 text-white transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
