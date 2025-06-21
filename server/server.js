import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import crypto from 'crypto'
import Stripe from 'stripe'

const app = express()
const PORT = process.env.PORT || 5000

// Stripe 설정
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2023-10-16',
})

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 100, // Number of requests
  duration: 900, // Per 15 minutes
})

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting middleware
const rateLimitMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip)
    next()
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    })
  }
}

app.use(rateLimitMiddleware)

// In-memory storage (in production, use a proper database)
const links = new Map()
const analytics = new Map()
const subscriptions = new Map() // 구독 정보 저장

// Helper functions
const generateShortCode = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Link shortener endpoints
app.post('/api/shorten', (req, res) => {
  const { url, customCode } = req.body

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({
      error: 'Invalid URL',
      message: 'Please provide a valid URL'
    })
  }

  let shortCode = customCode
  
  // Generate random code if custom code not provided
  if (!shortCode) {
    do {
      shortCode = generateShortCode()
    } while (links.has(shortCode))
  } else {
    // Check if custom code already exists
    if (links.has(shortCode)) {
      return res.status(409).json({
        error: 'Code already exists',
        message: 'This custom code is already taken'
      })
    }
  }

  const linkData = {
    id: crypto.randomUUID(),
    originalUrl: url,
    shortCode,
    shortUrl: `${req.protocol}://${req.get('host')}/s/${shortCode}`,
    createdAt: new Date().toISOString(),
    clicks: 0,
    createdBy: req.ip
  }

  links.set(shortCode, linkData)
  analytics.set(shortCode, [])

  res.json({
    success: true,
    data: {
      id: linkData.id,
      originalUrl: linkData.originalUrl,
      shortUrl: linkData.shortUrl,
      shortCode: linkData.shortCode,
      createdAt: linkData.createdAt
    }
  })
})

// Redirect shortened URL
app.get('/s/:code', (req, res) => {
  const { code } = req.params
  const linkData = links.get(code)

  if (!linkData) {
    return res.status(404).json({
      error: 'Link not found',
      message: 'The requested short link does not exist'
    })
  }

  // Track click
  linkData.clicks++
  const clickData = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer') || 'direct'
  }
  
  const clickHistory = analytics.get(code) || []
  clickHistory.push(clickData)
  analytics.set(code, clickHistory)

  // Redirect to original URL
  res.redirect(linkData.originalUrl)
})

// Get link analytics
app.get('/api/analytics/:code', (req, res) => {
  const { code } = req.params
  const linkData = links.get(code)
  const clickHistory = analytics.get(code) || []

  if (!linkData) {
    return res.status(404).json({
      error: 'Link not found',
      message: 'The requested short link does not exist'
    })
  }

  // Basic analytics
  const today = new Date().toDateString()
  const todayClicks = clickHistory.filter(click => 
    new Date(click.timestamp).toDateString() === today
  ).length

  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)
  const weeklyClicks = clickHistory.filter(click => 
    new Date(click.timestamp) >= last7Days
  ).length

  res.json({
    success: true,
    data: {
      shortCode: code,
      originalUrl: linkData.originalUrl,
      shortUrl: linkData.shortUrl,
      totalClicks: linkData.clicks,
      todayClicks,
      weeklyClicks,
      createdAt: linkData.createdAt,
      clickHistory: clickHistory.slice(-50) // Last 50 clicks
    }
  })
})

// Get user's links (by IP for demo purposes)
app.get('/api/my-links', (req, res) => {
  const userLinks = Array.from(links.values())
    .filter(link => link.createdBy === req.ip)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 50) // Limit to 50 most recent

  res.json({
    success: true,
    data: userLinks.map(link => ({
      id: link.id,
      originalUrl: link.originalUrl,
      shortUrl: link.shortUrl,
      shortCode: link.shortCode,
      clicks: link.clicks,
      createdAt: link.createdAt
    }))
  })
})

// QR Code generation endpoint (using external service or library)
app.post('/api/qr-generate', (req, res) => {
  const { text, size = 256, errorLevel = 'M' } = req.body

  if (!text) {
    return res.status(400).json({
      error: 'Missing text',
      message: 'Please provide text to generate QR code'
    })
  }

  // In a real implementation, you would generate the QR code here
  // For now, we'll return a success response
  res.json({
    success: true,
    message: 'QR code generation request received',
    data: {
      text,
      size,
      errorLevel,
      timestamp: new Date().toISOString()
    }
  })
})

// Password generation endpoint
app.post('/api/generate-password', (req, res) => {
  const {
    length = 12,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    excludeSimilar = false
  } = req.body

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const similarChars = 'il1Lo0O'

  let charset = ''
  
  if (includeUppercase) charset += uppercaseChars
  if (includeLowercase) charset += lowercaseChars
  if (includeNumbers) charset += numberChars
  if (includeSymbols) charset += symbolChars
  
  if (excludeSimilar) {
    charset = charset.split('').filter(char => !similarChars.includes(char)).join('')
  }

  if (!charset) {
    return res.status(400).json({
      error: 'Invalid options',
      message: 'At least one character type must be selected'
    })
  }

  let password = ''
  
  // Ensure at least one character from each selected type
  if (includeUppercase) password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]
  if (includeLowercase) password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
  if (includeNumbers) password += numberChars[Math.floor(Math.random() * numberChars.length)]
  if (includeSymbols) password += symbolChars[Math.floor(Math.random() * symbolChars.length)]

  // Fill remaining length
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }

  // Shuffle the password
  password = password.split('').sort(() => Math.random() - 0.5).join('')

  res.json({
    success: true,
    data: {
      password,
      length: password.length,
      timestamp: new Date().toISOString()
    }
  })
})

// Global statistics endpoint
app.get('/api/stats', (req, res) => {
  const totalLinks = links.size
  const totalClicks = Array.from(links.values()).reduce((sum, link) => sum + link.clicks, 0)
  
  const today = new Date().toDateString()
  const todayLinks = Array.from(links.values()).filter(link => 
    new Date(link.createdAt).toDateString() === today
  ).length

  res.json({
    success: true,
    data: {
      totalLinks,
      totalClicks,
      todayLinks,
      activeUsers: new Set(Array.from(links.values()).map(link => link.createdBy)).size,
      timestamp: new Date().toISOString()
    }
  })
})

// Stripe 결제 관련 엔드포인트들

// 결제 세션 생성
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, planType, userEmail, successUrl, cancelUrl } = req.body

    // 실제 환경에서는 데이터베이스에서 가격 정보를 가져와야 합니다
    const prices = {
      basic: 'price_1234567890abcdef', // 실제 Stripe Price ID로 교체
      pro: 'price_0987654321fedcba'    // 실제 Stripe Price ID로 교체
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: prices[planType] || prices.basic,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planType,
        userId: req.ip, // 실제 환경에서는 실제 사용자 ID 사용
      },
    })

    res.json({
      success: true,
      id: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('Stripe 결제 세션 생성 오류:', error)
    res.status(500).json({
      success: false,
      error: 'Payment session creation failed',
      message: error.message
    })
  }
})

// Stripe 웹훅 처리 (결제 완료 시 호출됨)
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // 이벤트 처리
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      console.log('결제 완료:', session)
      
      // 구독 정보 저장
      subscriptions.set(session.metadata.userId, {
        customerId: session.customer,
        subscriptionId: session.subscription,
        planType: session.metadata.planType,
        status: 'active',
        createdAt: new Date().toISOString()
      })
      break

    case 'customer.subscription.deleted':
      const subscription = event.data.object
      console.log('구독 취소:', subscription)
      
      // 구독 정보 업데이트
      const userId = Array.from(subscriptions.entries())
        .find(([_, sub]) => sub.subscriptionId === subscription.id)?.[0]
      
      if (userId) {
        const userSub = subscriptions.get(userId)
        userSub.status = 'canceled'
        subscriptions.set(userId, userSub)
      }
      break

    default:
      console.log(`처리되지 않은 이벤트 타입: ${event.type}`)
  }

  res.json({ received: true })
})

// 구독 상태 확인
app.get('/api/subscription-status', (req, res) => {
  const userId = req.ip // 실제 환경에서는 JWT 토큰에서 사용자 ID 추출
  const subscription = subscriptions.get(userId)

  if (!subscription || subscription.status !== 'active') {
    return res.json({
      success: true,
      data: {
        active: false,
        plan: null
      }
    })
  }

  res.json({
    success: true,
    data: {
      active: true,
      plan: subscription.planType,
      status: subscription.status,
      createdAt: subscription.createdAt
    }
  })
})

// 구독 취소
app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const userId = req.ip // 실제 환경에서는 JWT 토큰에서 사용자 ID 추출
    const subscription = subscriptions.get(userId)

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      })
    }

    // Stripe에서 구독 취소
    await stripe.subscriptions.del(subscription.subscriptionId)

    // 로컬 상태 업데이트
    subscription.status = 'canceled'
    subscriptions.set(userId, subscription)

    res.json({
      success: true,
      message: 'Subscription canceled successfully'
    })
  } catch (error) {
    console.error('구독 취소 오류:', error)
    res.status(500).json({
      success: false,
      error: 'Subscription cancellation failed',
      message: error.message
    })
  }
})

// 임시 프리미엄 활성화 (테스트용)
app.post('/api/activate-premium', (req, res) => {
  const { planType = 'basic' } = req.body
  const userId = req.ip

  subscriptions.set(userId, {
    customerId: 'test_customer',
    subscriptionId: 'test_subscription',
    planType,
    status: 'active',
    createdAt: new Date().toISOString()
  })

  res.json({
    success: true,
    message: `${planType} 플랜이 활성화되었습니다 (테스트용)`
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on our end'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 API available at http://localhost:${PORT}/api`)
  console.log(`🔗 Short links redirect at http://localhost:${PORT}/s/:code`)
})