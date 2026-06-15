import './globals.css'
import {sanityClient} from '@/sanity/lib/client'
import {navigationQuery, siteSettingsQuery} from '@/sanity/lib/queries'
import {SiteNavigation} from '@/components/SiteNavigation'
import {SiteFooter} from '@/components/SiteFooter'

export const metadata = {
  title: 'Audacious Sheet Metal International B.V.',
  description: 'Voor intelligent plaatwerk.'
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const [navigation, settings] = await Promise.all([
    sanityClient.fetch(navigationQuery),
    sanityClient.fetch(siteSettingsQuery)
  ])

  return (
    <html lang="nl">
      <body>
        <div className="next-page">
          <SiteNavigation navigation={navigation} />
          {children}
          <SiteFooter settings={settings} />
        </div>
      </body>
    </html>
  )
}
