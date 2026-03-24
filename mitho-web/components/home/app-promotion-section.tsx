import { MithoSection } from "@/components/ui/mitho-section"

export function AppPromotionSection() {
  return (
    <MithoSection className="bg-gradient-to-br from-brand-dark-green to-brand-deep-green text-white overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance">
            The Best Food Discovery is Always in Your Pocket
          </h2>
          <p className="text-lg text-white/80 max-w-lg">
            Get instant notifications about new restaurants, exclusive deals, and personalized recommendations based on
            your taste.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-white text-brand-dark-green px-5 py-3 rounded-xl hover:bg-brand-soft-beige transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <div className="text-left">
                <p className="text-xs opacity-80">Download on the</p>
                <p className="text-sm font-semibold">App Store</p>
              </div>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-white text-brand-dark-green px-5 py-3 rounded-xl hover:bg-brand-soft-beige transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
              </svg>
              <div className="text-left">
                <p className="text-xs opacity-80">Get it on</p>
                <p className="text-sm font-semibold">Google Play</p>
              </div>
            </a>
          </div>

          {/* QR Code */}
          <div className="flex items-center gap-4 pt-4">
            <div className="w-24 h-24 bg-white rounded-xl p-2">
              <div className="w-full h-full bg-brand-soft-beige rounded-lg flex items-center justify-center">
                <span className="text-xs text-brand-dark-green text-center">QR Code</span>
              </div>
            </div>
            <p className="text-sm text-white/70">
              Scan to download
              <br />
              the app
            </p>
          </div>
        </div>

        {/* Right - Phone Mockups */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            {/* Phone 1 */}
            <div className="w-48 md:w-56 h-96 md:h-[420px] bg-white rounded-[2.5rem] p-2 shadow-2xl transform -rotate-6 translate-x-8">
              <div className="w-full h-full bg-brand-soft-beige rounded-[2rem] overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=200"
                  alt="Mitho Cha! App Home Screen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Phone 2 */}
            <div className="absolute top-8 -left-8 w-48 md:w-56 h-96 md:h-[420px] bg-white rounded-[2.5rem] p-2 shadow-2xl transform rotate-6">
              <div className="w-full h-full bg-brand-soft-beige rounded-[2rem] overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=200"
                  alt="Mitho Cha! App Restaurant Detail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MithoSection>
  )
}
