const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full bg-white py-2 text-gray-400">
      <div className="container mx-auto flex flex-col items-center">
        <div className="mb-4 flex space-x-4">
          <a
            href="https://github.com/boostcampwm-2024/web09-DailyRoad"
            className="hover:text-gray-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://elastic-bread-9ef.notion.site/12963e6f4ee98074b6f9f70cfa9ac836"
            className="hover:text-gray-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Notion
          </a>
        </div>
        <p className="text-sm">2024 DailyRoad. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
