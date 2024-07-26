import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Code Feedback",
  description: "Feedback for symptoms of common programming misconceptions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="http://www.skulpt.org/js/skulpt.min.js"/>
        <script src="http://www.skulpt.org/js/skulpt-stdlib.js"/>
      </head>
      <body className={inter.className}>{children}
      
      </body>
    </html>
  );
}
