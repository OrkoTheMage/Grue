import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <title>Grue</title>
      <body>
        {children}
      </body>
    </html>
  )
}
