import "./globals.css";
import LayoutShell from "../components/layout/layoutshell";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "BlueLineOps",
  description: "Operational Intelligence Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <LayoutShell>
            {children}
          </LayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}