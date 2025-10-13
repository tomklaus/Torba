import './globals.css'

export const metadata = {
  title: 'Torba Text Storage',
  description: 'Save and retrieve text with PostgreSQL',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
