import React from 'react'
import { Link } from 'react-router-dom'
import { QrCode, Link2, Key, Palette, Type, Zap, Users, Star } from 'lucide-react'

const Home: React.FC = () => {
  const tools = [
    {
      path: '/qr-generator',
      title: 'QR 코드 생성기',
      description: '텍스트, URL, 연락처를 QR 코드로 변환하세요',
      icon: QrCode,
      color: 'bg-blue-500',
      usage: '1,234'
    },
    {
      path: '/link-shortener',
      title: '링크 단축기',
      description: '긴 URL을 짧고 기억하기 쉬운 링크로 변환',
      icon: Link2,
      color: 'bg-green-500',
      usage: '567'
    },
    {
      path: '/password-generator',
      title: '비밀번호 생성기',
      description: '안전하고 강력한 비밀번호를 생성하세요',
      icon: Key,
      color: 'bg-red-500',
      usage: '890'
    },
    {
      path: '/color-tools',
      title: '색상 도구',
      description: '색상 팔레트, 그라디언트, 색상 변환 도구',
      icon: Palette,
      color: 'bg-purple-500',
      usage: '345'
    },
    {
      path: '/text-tools',
      title: '텍스트 도구',
      description: '대소문자 변환, 단어 수 계산 등 텍스트 처리',
      icon: Type,
      color: 'bg-orange-500',
      usage: '678'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white">
        <Zap className="h-16 w-16 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">UtilityHub</h1>
        <p className="text-xl mb-6 opacity-90">
          일상에서 필요한 모든 온라인 도구를 한 곳에서
        </p>
        <div className="flex justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>10,000+ 사용자</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>4.9/5 평점</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>100% 무료</span>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">인기 도구</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="tool-card group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${tool.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">오늘 사용: {tool.usage}회</span>
                      <span className="text-primary-600 text-sm font-medium group-hover:text-primary-700">
                        사용하기 →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">왜 UtilityHub인가요?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">빠르고 간편</h3>
            <p className="text-gray-600 text-sm">복잡한 설치 없이 브라우저에서 바로 사용</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">높은 품질</h3>
            <p className="text-gray-600 text-sm">전문가가 개발한 정확하고 안정적인 도구</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">무료 사용</h3>
            <p className="text-gray-600 text-sm">기본 기능은 완전 무료, 프리미엄은 선택사항</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 