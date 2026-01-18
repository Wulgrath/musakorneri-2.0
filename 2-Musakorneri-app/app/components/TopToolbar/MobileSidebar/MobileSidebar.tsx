import { selectCurrentUserId } from "@/app/store/currentUser/selectors/current-user.selectors";
import Link from "next/link";
import { useSelector } from "react-redux";

interface MobileSidebarProps {
  setSidebarOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  handleLogout: () => void;
}

export const MobileSidebar = ({
  setSidebarOpen,
  isLoggedIn,
  handleLogout,
}: MobileSidebarProps) => {
  const currentUserId = useSelector(selectCurrentUserId);

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setSidebarOpen(false)}
      />
      <div className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Menu
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-900 dark:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="p-4 space-y-4">
          <Link
            href="/"
            className="block py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2"
            onClick={() => setSidebarOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/album-charts"
            className="block py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2"
            onClick={() => setSidebarOpen(false)}
          >
            Album Charts
          </Link>
          {isLoggedIn && (
            <Link
              href="/review-album"
              className="block py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2"
              onClick={() => setSidebarOpen(false)}
            >
              Review album
            </Link>
          )}
          <hr className="border-gray-200 dark:border-gray-700" />
          {isLoggedIn ? (
            <>
              <Link
                href={`/user/?id=${currentUserId}`}
                className="block py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2"
                onClick={() => setSidebarOpen(false)}
              >
                My Reviews
              </Link>
              <Link
                href="/profile"
                className="block py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2"
                onClick={() => setSidebarOpen(false)}
              >
                Profile
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                className="block w-full text-left py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="block py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2"
              onClick={() => setSidebarOpen(false)}
            >
              Login
            </a>
          )}
        </nav>
      </div>
    </div>
  );
};
