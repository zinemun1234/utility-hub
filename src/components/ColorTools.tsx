import React, { useState } from 'react'
import { Palette, Copy, RefreshCw, Pipette } from 'lucide-react'
import toast from 'react-hot-toast'

interface Color {
  hex: string
  rgb: string
  hsl: string
}

const ColorTools: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('#3B82F6')
  const [palette, setPalette] = useState<string[]>([])
  const [paletteType, setPaletteType] = useState<'monochromatic' | 'analogous' | 'complementary' | 'triadic'>('monochromatic')

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100
    l /= 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = l - c / 2
    let r = 0, g = 0, b = 0

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x
    }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  const getColorInfo = (hex: string): Color => {
    const rgb = hexToRgb(hex)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    
    return {
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    }
  }

  const generatePalette = () => {
    const rgb = hexToRgb(selectedColor)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    let colors: string[] = []

    switch (paletteType) {
      case 'monochromatic':
        for (let i = 0; i < 5; i++) {
          const lightness = Math.max(10, Math.min(90, hsl.l + (i - 2) * 20))
          colors.push(hslToHex(hsl.h, hsl.s, lightness))
        }
        break
        
      case 'analogous':
        for (let i = 0; i < 5; i++) {
          const hue = (hsl.h + (i - 2) * 30 + 360) % 360
          colors.push(hslToHex(hue, hsl.s, hsl.l))
        }
        break
        
      case 'complementary':
        colors = [
          selectedColor,
          hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
          hslToHex(hsl.h, Math.max(10, hsl.s - 20), hsl.l),
          hslToHex((hsl.h + 180) % 360, Math.max(10, hsl.s - 20), hsl.l),
          hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 20))
        ]
        break
        
      case 'triadic':
        colors = [
          selectedColor,
          hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
          hslToHex(hsl.h, Math.max(10, hsl.s - 30), hsl.l),
          hslToHex((hsl.h + 120) % 360, Math.max(10, hsl.s - 30), hsl.l)
        ]
        break
    }

    setPalette(colors)
    toast.success('새 팔레트가 생성되었습니다!')
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('클립보드에 복사되었습니다!')
    } catch (error) {
      toast.error('복사에 실패했습니다')
    }
  }

  const generateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
    setSelectedColor(randomColor)
  }

  const colorInfo = getColorInfo(selectedColor)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">색상 도구</h1>
        <p className="text-gray-600">색상 팔레트 생성, 색상 변환, 그라디언트 생성 도구</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Picker */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Pipette className="h-5 w-5 mr-2" />
            색상 선택
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div 
                className="w-24 h-24 rounded-lg border-2 border-gray-300 cursor-pointer"
                style={{ backgroundColor: selectedColor }}
                onClick={() => document.getElementById('colorPicker')?.click()}
              />
              <div className="flex-1">
                <input
                  id="colorPicker"
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded cursor-pointer"
                />
                <button
                  onClick={generateRandomColor}
                  className="btn-secondary w-full mt-2 flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>랜덤 색상</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">HEX</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm">{colorInfo.hex}</span>
                  <button
                    onClick={() => copyToClipboard(colorInfo.hex)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">RGB</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm">{colorInfo.rgb}</span>
                  <button
                    onClick={() => copyToClipboard(colorInfo.rgb)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">HSL</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm">{colorInfo.hsl}</span>
                  <button
                    onClick={() => copyToClipboard(colorInfo.hsl)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Palette Generator */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            팔레트 생성
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">팔레트 타입</label>
              <select
                value={paletteType}
                onChange={(e) => setPaletteType(e.target.value as any)}
                className="input-field"
              >
                <option value="monochromatic">단색 조화</option>
                <option value="analogous">유사 색상</option>
                <option value="complementary">보색</option>
                <option value="triadic">삼색 조화</option>
              </select>
            </div>

            <button
              onClick={generatePalette}
              className="btn-primary w-full"
            >
              팔레트 생성
            </button>

            {palette.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  {palette.map((color, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
                
                <div className="space-y-1">
                  {palette.map((color, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="font-mono">{color.toUpperCase()}</span>
                      <button
                        onClick={() => copyToClipboard(color)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gradient Generator */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">그라디언트 생성기</h2>
        
        <div className="space-y-4">
          <div 
            className="h-32 rounded-lg border border-gray-300"
            style={{
              background: `linear-gradient(45deg, ${selectedColor}, ${palette[1] || '#ffffff'})`
            }}
          />
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">CSS:</span>
            <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
              background: linear-gradient(45deg, {selectedColor}, {palette[1] || '#ffffff'});
            </code>
            <button
              onClick={() => copyToClipboard(`background: linear-gradient(45deg, ${selectedColor}, ${palette[1] || '#ffffff'});`)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Color Theory */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">🎨 색상 이론</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">단색 조화</h4>
            <p>같은 색상의 명도와 채도를 변화시킨 조화로운 팔레트</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">유사 색상</h4>
            <p>색상환에서 인접한 색상들로 구성된 자연스러운 조화</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">보색</h4>
            <p>색상환에서 정반대 위치의 색상으로 강한 대비 효과</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">삼색 조화</h4>
            <p>색상환을 3등분한 위치의 색상들로 역동적인 조화</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorTools 