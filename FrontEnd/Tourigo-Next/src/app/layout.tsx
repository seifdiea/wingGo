import "./globals.css";
if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}
import "../style/index.scss";
import AppProvider from "@/contextApi/AppProvider";
import ReduxProvider from "@/redux/provider";
import { Toaster } from "sonner";
import { CurrencyProvider } from "@/contextApi/CurrencyContext"; // <-- Import CurrencyProvider
export const metadata = {
  title: "WingGo",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <head>
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="description" content="Generated by create next app" />
          <meta name="robots" content="noindex, follow" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link rel="icon" href="/favicon.ico" />
        </head>

        <body suppressHydrationWarning={true}>
          <ReduxProvider>
          <CurrencyProvider> {/* <-- Wrap CurrencyProvider */}
              <AppProvider>
                {children}
              </AppProvider>
              <Toaster position="top-center" richColors />
            </CurrencyProvider> {/* <-- Close CurrencyProvider */}
          </ReduxProvider>
        </body>
      </html>
    </>
  );
}
