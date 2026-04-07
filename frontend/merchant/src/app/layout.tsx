import "./globals.css";
import { ErrorProvider } from "@/context/error-context";
import { ErrorModal } from "@/components/error-modal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorProvider>
          <ErrorModal />
          {children}
        </ErrorProvider>
      </body>
    </html>
  );
}