import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { QrCode, Link2, Key, Palette, Type } from 'lucide-react'

const Navigation: React.FC = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/qr-generator', label: 'QR 코드', icon: QrCode },
    { path: '/link-shortener', label: '링크 단축', icon: Link2 },
    { path: '/password-generator', label: '비밀번호', icon: Key },
    { path: '/color-tools', label: '색상 도구', icon: Palette },
    { path: '/text-tools', label: '텍스트 도구', icon: Type },
  ]
  
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation 