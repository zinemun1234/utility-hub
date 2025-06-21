import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Download, Copy, Share2, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'

const QRGenerator: React.FC = () => {
  const [text, setText] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [size, setSize] = useState(256)
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [color, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [loading, setLoading] = useState(false)

  const generateQRCode = async () => {
    if (!text.trim()) {
      toast.error('텍스트를 입력해주세요')
      return
    }

    setLoading(true)
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: color,
          light: bgColor
        }
      })
      setQrCodeUrl(url)
      toast.success('QR 코드가 생성되었습니다!')
    } catch (error) {
      toast.error('QR 코드 생성에 실패했습니다')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return
    
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = qrCodeUrl
    link.click()
    toast.success('QR 코드가 다운로드되었습니다!')
  }

  const copyToClipboard = async () => {
    if (!qrCodeUrl) return
    
    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      toast.success('클립보드에 복사되었습니다!')
    } catch (error) {
      toast.error('복사에 실패했습니다')
    }
  }

  const shareQRCode = async () => {
    if (!navigator.share || !qrCodeUrl) {
      toast.error('공유 기능을 지원하지 않는 브라우저입니다')
      return
    }

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const file = new File([blob], 'qrcode.png', { type: 'image/png' })
      
      await navigator.share({
        title: 'QR 코드',
        text: text,
        files: [file]
      })
    } catch (error) {
      toast.error('공유에 실패했습니다')
    }
  }

  useEffect(() => {
    if (text.trim()) {
      const debounceTimer = setTimeout(() => {
        generateQRCode()
      }, 500)
      
      return () => clearTimeout(debounceTimer)
    }
  }, [text, size, errorLevel, color, bgColor])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">QR 코드 생성기</h1>
        <p className="text-gray-600">텍스트, URL, 연락처 정보를 QR 코드로 변환하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            설정
          </h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              텍스트 또는 URL
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="QR 코드로 변환할 텍스트나 URL을 입력하세요..."
              className="input-field h-32 resize-none"
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">
              {text.length}/1000 글자
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                크기
              </label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="input-field"
              >
                <option value={128}>128px</option>
                <option value={256}>256px</option>
                <option value={512}>512px</option>
                <option value={1024}>1024px</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                오류 수정 레벨
              </label>
              <select
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                className="input-field"
              >
                <option value="L">낮음 (7%)</option>
                <option value="M">보통 (15%)</option>
                <option value="Q">높음 (25%)</option>
                <option value="H">최고 (30%)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                전경색
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="input-field flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                배경색
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="input-field flex-1"
                />
              </div>
            </div>
          </div>

          <button
            onClick={generateQRCode}
            disabled={!text.trim() || loading}
            className="btn-primary w-full"
          >
            {loading ? '생성 중...' : 'QR 코드 생성'}
          </button>
        </div>

        {/* Preview Section */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">미리보기</h2>
          
          {qrCodeUrl ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={qrCodeUrl}
                  alt="Generated QR Code"
                  className="border border-gray-200 rounded-lg"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={downloadQRCode}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>다운로드</span>
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>복사</span>
                </button>
                
                <button
                  onClick={shareQRCode}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>공유</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">텍스트를 입력하면 QR 코드가 여기에 표시됩니다</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">💡 사용 팁</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">URL 단축</h4>
            <p>긴 URL은 QR 코드가 복잡해집니다. 링크 단축기를 먼저 사용해보세요.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">오류 수정 레벨</h4>
            <p>QR 코드가 손상될 가능성이 있다면 높은 레벨을 선택하세요.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">색상 대비</h4>
            <p>스캔 성능을 위해 전경색과 배경색의 대비를 충분히 주세요.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">크기 선택</h4>
            <p>인쇄용은 512px 이상, 웹용은 256px가 적당합니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRGenerator 