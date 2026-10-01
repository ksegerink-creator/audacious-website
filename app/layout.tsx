import './globals.css'
import {cms} from '@/lib/cms'
import {SiteNavigation} from '@/components/SiteNavigation'
import {SiteFooter} from '@/components/SiteFooter'

export const metadata = {
  title: 'Audacious Sheet Metal International B.V.',
  description: 'Voor intelligent en gedurfd plaatwerk.'
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const [navigation, settings] = await Promise.all([cms.navigation(), cms.settings()])

  return (
    <html lang="nl">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8EHNBNNHQB" />
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8EHNBNNHQB');
        `}} />
      </head>
      <body>
        <div className="next-page">
          <SiteNavigation navigation={navigation as any} />
          {children}
          <SiteFooter settings={settings} />
        </div>
      </body>
    </html>
  )
}
