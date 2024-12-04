import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { uploadBanner } from '../../api/image';

interface DashboardMenuItem {
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode;
}

interface BannerFormData {
  imageUrl: File | null;
  redirectUrl: string;
  startedAt: string;
  endedAt: string;
}

const DashBoard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [BannerFormData, setBannerFormData] = useState<BannerFormData>({
    imageUrl: null,
    redirectUrl: '',
    startedAt: new Date().toISOString().split('T')[0],
    endedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  });

  const [activeBannerTab, setActiveBannerTab] = useState<'register' | 'modify'>(
    'register',
  );

  const ValidateBannerInput = (banner: BannerFormData) => {
    const startDate = new Date(banner.startedAt);
    const endedDate = new Date(banner.endedAt);

    if (startDate >= endedDate) {
      alert('배너 게시 시작일자는 종료일자보다 이르면 안됩니다.');
      return false;
    }
    return true;
  };

  const handleBannerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value, files } = e.target;
    if (name === 'imageUrl' && files) {
      setBannerFormData((prevData) => ({
        ...prevData,
        imageUrl: files[0],
      }));
    } else {
      setBannerFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ValidateBannerInput(BannerFormData)) {
      return;
    }
    try {
      await uploadBanner(BannerFormData);
    } catch (err) {
      alert('배너 업로드 실패');
      throw err;
    }
  };

  const menuItems: DashboardMenuItem[] = [
    {
      icon: <ClipboardList />,
      label: '배너 관리',
      content: (
        <div className="rounded-lg bg-white p-4 shadow-md">
          <div className="mb-4 flex border-b">
            {[
              { key: 'register', label: '배너 등록' },
              { key: 'modify', label: '배너 수정' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveBannerTab(tab.key as 'register' | 'modify')
                }
                className={`border-b-2 px-4 py-2 transition-colors duration-300 ${activeBannerTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <h2 className="mb-4 text-xl font-bold">배너 관리</h2>
          {activeBannerTab === 'register' && (
            <form onSubmit={handleBannerSubmit} className="space-y-2">
              <label htmlFor="imageUrl" className="mb-2 block text-gray-700">
                이미지 URL
              </label>
              <input
                type="file"
                id="imageUrl"
                name="imageUrl"
                accept="image/*"
                onChange={handleBannerInputChange}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <label htmlFor="redirectUrl" className="mb-2 block text-gray-700">
                리다이렉트 URL
              </label>
              <input
                type="text"
                id="redirectUrl"
                name="redirectUrl"
                value={BannerFormData.redirectUrl}
                onChange={handleBannerInputChange}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="리다이렉트 URL을 입력해주세요."
                required
              />
              <label htmlFor="startedAt" className="mb-2 block text-gray-700">
                배너 게시 시작일자
              </label>
              <input
                type="date"
                id="startedAt"
                name="startedAt"
                value={BannerFormData.startedAt}
                onChange={handleBannerInputChange}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <label htmlFor="endedAt" className="mb-2 block text-gray-700">
                배너 게시 종료일자
              </label>
              <input
                type="date"
                id="endedAt"
                name="endedAt"
                value={BannerFormData.endedAt}
                onChange={handleBannerInputChange}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="rounded-lg border px-4 py-2 text-gray-600 hover:text-black"
                onClick={() => handleBannerSubmit}
              >
                제출
              </button>
            </form>
          )}
          {activeBannerTab === 'modify' && <form></form>}
        </div>
      ),
    },
  ];
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={` ${isSidebarCollapsed ? 'w-20' : 'w-64'} relative bg-white shadow-md transition-all duration-300`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute right-20 right-4 top-4 text-gray-600 hover:text-black"
        >
          {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
        <div className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setSelectedMenu(item.label)}
              className={`mb-2 flex w-full items-center rounded-lg p-3 ${
                selectedMenu === item.label
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              {item.icon}
              {!isSidebarCollapsed && (
                <span className="ml-3">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8">
        {menuItems.find((item) => item.label === selectedMenu)?.content}
      </div>
    </div>
  );
};

export default DashBoard;
