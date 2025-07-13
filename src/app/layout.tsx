import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Vind",
  description: "Modern day Vine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress common video playback interruption errors
              window.addEventListener('error', function(e) {
                if (e.message && (
                  e.message.includes('The play() request was interrupted') ||
                  e.message.includes('AbortError') ||
                  e.message.includes('buffer') ||
                  e.message.includes('stall')
                )) {
                  e.preventDefault();
                  console.log('Suppressed video error:', e.message);
                  return false;
                }
              });
              
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && (
                  e.reason.message.includes('The play() request was interrupted') ||
                  e.reason.message.includes('AbortError')
                )) {
                  e.preventDefault();
                  console.log('Suppressed video promise rejection:', e.reason.message);
                  return false;
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
