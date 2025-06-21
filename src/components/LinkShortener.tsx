import React, { useState } from 'react'
import { Link2, Copy, ExternalLink, BarChart3, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface ShortenedLink {
  id: string
  originalUrl: string
  shortUrl: string
  shortCode: string
  clicks: number
  createdAt: string
}

const LinkShortener: React.FC = () => {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [shortenedLinks, setShortenedLinks] = useState<ShortenedLink[]>([])

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const shortenUrl = async () => {
    if (!url.trim()) {
      toast.error('URL을 입력해주세요')
      return
    }

    if (!isValidUrl(url)) {
      toast.error('올바른 URL 형식이 아닙니다')
      return
    }

    setLoading(true)
    
    try {
      // 실제 구현에서는 서버 API를 호출합니다
      const shortCode = customCode.trim() || generateShortCode()
      const shortUrl = `https://utilityhub.co/${shortCode}`
      
      const newLink: ShortenedLink = {
        id: Date.now().toString(),
        originalUrl: url,
        shortUrl,
        shortCode,
        clicks: 0,
        createdAt: new Date().toISOString()
      }

      setShortenedLinks(prev => [newLink, ...prev])
      setUrl('')
      setCustomCode('')
      toast.success('링크가 단축되었습니다!')
    } catch (error) {
      toast.error('링크 단축에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('클립보드에 복사되었습니다!')
    } catch (error) {
      toast.error('복사에 실패했습니다')
    }
  }

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">링크 단축기</h1>
        <p className="text-gray-600">긴 URL을 짧고 기억하기 쉬운 링크로 변환하고 클릭 통계를 확인하세요</p>
      </div>

      {/* URL Input Section */}
      <div className="card">
        <h2 className="text-xl font-semibold flex items-center mb-4">
          <Link2 className="h-5 w-5 mr-2" />
          링크 단축
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              원본 URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very-long-url..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              커스텀 코드 (선택사항)
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">utilityhub.co/</span>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="custom-code"
                className="input-field flex-1"
                maxLength={20}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              영문자와 숫자만 사용 가능 (최대 20자)
            </p>
          </div>

          <button
            onClick={shortenUrl}
            disabled={!url.trim() || loading}
            className="btn-primary w-full"
          >
            {loading ? '단축 중...' : '링크 단축하기'}
          </button>
        </div>
      </div>

      {/* Shortened Links List */}
      {shortenedLinks.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">단축된 링크</h2>
          
          <div className="space-y-3">
            {shortenedLinks.map((link) => (
              <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-medium text-primary-600">
                        {link.shortUrl}
                      </span>
                      <button
                        onClick={() => copyToClipboard(link.shortUrl)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="복사"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openUrl(link.shortUrl)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="새 탭에서 열기"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 truncate" title={link.originalUrl}>
                      {link.originalUrl}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 ml-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{link.clicks}</span>
                    </div>
                    <div>
                      {new Date(link.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(link.shortUrl)}
                    className="btn-secondary text-xs"
                  >
                    링크 복사
                  </button>
                  <button
                    onClick={() => copyToClipboard(link.originalUrl)}
                    className="btn-secondary text-xs"
                  >
                    원본 복사
                  </button>
                  <div className="flex-1"></div>
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">통계 보기</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">🚀 주요 기능</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">무료 링크 단축</h4>
            <p>무제한으로 긴 URL을 짧은 링크로 변환할 수 있습니다.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">커스텀 코드</h4>
            <p>기억하기 쉬운 커스텀 코드로 링크를 개인화하세요.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">클릭 통계</h4>
            <p>링크 클릭 수와 방문 통계를 실시간으로 확인하세요.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">안전한 링크</h4>
            <p>모든 링크는 안전성 검사를 거쳐 악성 사이트를 차단합니다.</p>
          </div>
        </div>
      </div>

      {/* Premium Features */}
      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <div className="bg-yellow-500 p-2 rounded-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              💎 프리미엄으로 업그레이드
            </h3>
            <ul className="text-sm text-yellow-800 space-y-1 mb-4">
              <li>• 상세 클릭 분석 및 지역별 통계</li>
              <li>• 커스텀 도메인 사용</li>
              <li>• 링크 만료일 설정</li>
              <li>• 비밀번호로 링크 보호</li>
              <li>• API 액세스</li>
            </ul>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              월 $4.99로 업그레이드
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinkShortener 