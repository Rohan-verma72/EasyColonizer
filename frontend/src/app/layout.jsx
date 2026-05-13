import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "../styles/main.css";

export const metadata = {
  title: "Easy Colonizer | Premium Properties in Bhopal",
  description: "Verified real estate projects, site visits, and property guidance in Bhopal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
