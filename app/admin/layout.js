export const metadata = {
  title: "Ola Wood Admin",
  manifest: "/admin-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OW Admin",
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
};

export default function AdminLayout({ children }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function () {
                navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' }).catch(function () {});
              });
            }
          `,
        }}
      />
      {children}
    </>
  );
}
