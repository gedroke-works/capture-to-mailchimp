import React from "react";
import "./globals.css";

export const metadata = {
  title: "Copy Feather Lab",
  description: "Marketing Funnel for Local Business",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
