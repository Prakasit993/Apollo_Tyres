'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

interface CookieConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Always true - can't be disabled
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString(),
  })

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem('cookie-consent')
    if (!savedConsent) {
      // Show banner after a small delay for better UX
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const saveConsent = (consentData: CookieConsent) => {
    localStorage.setItem('cookie-consent', JSON.stringify(consentData))
    setShowBanner(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    const fullConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }
    saveConsent(fullConsent)
  }

  const acceptNecessaryOnly = () => {
    const minimalConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }
    saveConsent(minimalConsent)
  }

  const saveCustomConsent = () => {
    saveConsent({
      ...consent,
      timestamp: new Date().toISOString(),
    })
  }

  if (!showBanner) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl bg-white dark:bg-neutral-800 rounded-lg shadow-2xl border border-neutral-200 dark:border-neutral-700">
          <div className="p-6">
            {!showSettings ? (
              // Main Banner
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      🍪 เราใช้คุกกี้
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      เว็บไซต์นี้ใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ
                      คุกกี้บางประเภทจำเป็นต่อการทำงานของเว็บไซต์ (เช่น การเข้าสู่ระบบ)
                      ส่วนคุกกี้อื่นๆ ช่วยให้เราเข้าใจว่าคุณใช้งานเว็บไซต์อย่างไร
                      เพื่อนำมาปรับปรุงบริการต่อไป
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                      อ่านเพิ่มเติมใน{' '}
                      <Link
                        href="/cookie-policy"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        นโยบายคุกกี้
                      </Link>
                      {' '}และ{' '}
                      <Link
                        href="/privacy"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        นโยบายความเป็นส่วนตัว
                      </Link>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={acceptAll}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    ยอมรับทั้งหมด
                  </button>
                  <button
                    onClick={acceptNecessaryOnly}
                    className="flex-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    ยอมรับเฉพาะที่จำเป็น
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex-1 border-2 border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-300 font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    ตั้งค่า
                  </button>
                </div>
              </>
            ) : (
              // Settings Panel
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    ตั้งค่าคุกกี้
                  </h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Necessary Cookies */}
                  <div className="flex items-start justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-neutral-900 dark:text-white">
                          คุกกี้ที่จำเป็น
                        </h3>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                          จำเป็น
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        คุกกี้เหล่านี้จำเป็นต่อการทำงานของเว็บไซต์ เช่น การเข้าสู่ระบบ การจดจำตะกร้าสินค้า
                        ไม่สามารถปิดการใช้งานได้
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <div className="flex-1 pr-4">
                      <h3 className="font-bold text-neutral-900 dark:text-white mb-1">
                        คุกกี้เพื่อการวิเคราะห์
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        ช่วยให้เราเข้าใจว่าผู้ใช้งานเว็บไซต์อย่างไร เพื่อนำมาปรับปรุงบริการ (เช่น Google Analytics)
                      </p>
                    </div>
                    <button
                      onClick={() => setConsent({ ...consent, analytics: !consent.analytics })}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${consent.analytics ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'
                        }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${consent.analytics ? 'translate-x-6' : ''
                          }`}
                      ></div>
                    </button>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <div className="flex-1 pr-4">
                      <h3 className="font-bold text-neutral-900 dark:text-white mb-1">
                        คุกกี้เพื่อการตลาด
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        ใช้แสดงโฆษณาที่เกี่ยวข้องกับคุณบนเว็บไซต์อื่นๆ (เช่น Facebook Pixel, Google Ads)
                      </p>
                    </div>
                    <button
                      onClick={() => setConsent({ ...consent, marketing: !consent.marketing })}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${consent.marketing ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'
                        }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${consent.marketing ? 'translate-x-6' : ''
                          }`}
                      ></div>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveCustomConsent}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    บันทึกการตั้งค่า
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
