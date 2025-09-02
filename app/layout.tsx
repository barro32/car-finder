import '../styles/global.css';
import type { ReactNode } from 'react';

import QueryProvider from '../components/QueryProvider';
import { ThemeProvider } from '../components/ThemeProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
