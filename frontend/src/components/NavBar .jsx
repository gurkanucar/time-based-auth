import { NavLink } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export const NavBar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <nav className="bg-white border-gray-200 px-10  py-2.5 dark:bg-gray-900">
      <div className=" flex justify-center text-lg items-center">
        <div>
          <NavLink
            className="text-gray-900 dark:text-white px-3 py-2 rounded-md font-medium"
            exact
            to="/"
          >
            Home
          </NavLink>

          <NavLink
            className="text-gray-900 dark:text-white px-3 py-2 rounded-md font-medium"
            to="/dashboard"
          >
            Dashboard
          </NavLink>
          {isAuthenticated && (
            <NavLink
              className="text-gray-900 dark:text-white px-3 py-2 rounded-md font-medium"
              to="/otp-validator"
            >
              Otp Validator
            </NavLink>
          )}
        </div>

        {!isAuthenticated ? (
          <NavLink
            className="ml-auto text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            to="/login"
          >
            Login
          </NavLink>
        ) : (
          <button
            onClick={handleLogout}
            className="ml-auto text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};
