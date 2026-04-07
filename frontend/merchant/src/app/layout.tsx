import "./globals.css";
import { ErrorProvider } from "@/context/error-context";
import { AuthProvider } from "@/context/auth-context";
import { ErrorModal } from "@/components/error-modal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ErrorProvider>
            <ErrorModal />
            {children}
          </ErrorProvider>
        </AuthProvider>
      </body>
    </html>
  );
}