export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 mt-8 py-4">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Taneli Nyyssölä - Musakorneri
      </div>
    </footer>
  );
};
