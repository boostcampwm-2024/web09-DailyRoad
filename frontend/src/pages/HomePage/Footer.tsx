const Footer = () => {
  return (
    <footer className="w-full bg-white py-4 text-gray-400 shadow-md">
      <div className="container mx-auto flex flex-col items-center">
        <div className="mb-2 flex space-x-4">
          <a
            href="https://github.com/boostcampwm-2024/web09-DailyRoad"
            className="hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://elastic-bread-9ef.notion.site/12963e6f4ee98074b6f9f70cfa9ac836"
            className="hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Notion
          </a>
        </div>
        <p className="text-xs">2024 DailyRoad. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
