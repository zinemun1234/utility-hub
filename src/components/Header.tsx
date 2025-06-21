import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Crown, Menu } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">UtilityHub</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>오늘 사용량:</span>
              <span className="font-medium text-primary-600">5/10</span>
            </div>
            
            <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-200">
              <Crown className="h-4 w-4" />
              <span>프리미엄</span>
            </button>
            
            <button className="p-2 text-gray-600 hover:text-gray-900 md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 