import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { HighlightInit } from "@highlight-run/next/highlight-init";
import { CONSTANTS } from "@/lib/constants";
import Script from "next/script";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Sprintblitz",
  description: "Sprint management app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HighlightInit
        environment={process.env.NODE_ENV}
        manualStart={process.env.NODE_ENV === "development" ? true : false}
        projectId={CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID}
        tracingOrigins
        networkRecording={{
          enabled: process.env.NODE_ENV === "development" ? false : true,
          recordHeadersAndBody:
            process.env.NODE_ENV === "development" ? false : true,
        }}
        // backendUrl={CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_BACKEND_URL}
      />
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />

          <Script id="clarity-script" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ngwrleyjo7");
          `}
          </Script>
        </head>
        <body
          className={`${poppins.className} text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </>
  );
}
