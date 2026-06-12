export function SiteFooter({settings}: {settings: any}) {
  return (
    <footer className="cms-footer">
      <div className="container">
        <span>© 2026 {settings?.companyName || 'Audacious Sheet Metal International B.V.'}</span>
        <span style={{float: 'right'}}>{settings?.address?.split('\n')?.[1] || 'Zevenaar, Nederland'}</span>
      </div>
    </footer>
  )
}
