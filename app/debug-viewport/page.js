export const dynamic = "force-static";

export default function DebugViewport() {
  return (
    <html>
      <body style={{ margin: 0, background: "#000", color: "#0f0", fontFamily: "monospace" }}>
        <pre id="out" style={{ fontSize: "4vw", padding: "4vw", whiteSpace: "pre-wrap" }}>
          loading...
        </pre>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function report() {
                var lines = [
                  "window.innerWidth: " + window.innerWidth,
                  "window.innerHeight: " + window.innerHeight,
                  "document.documentElement.clientWidth: " + document.documentElement.clientWidth,
                  "screen.width: " + screen.width,
                  "screen.height: " + screen.height,
                  "devicePixelRatio: " + window.devicePixelRatio,
                  "visualViewport.width: " + (window.visualViewport ? window.visualViewport.width : "n/a"),
                  "userAgent: " + navigator.userAgent
                ];
                document.getElementById("out").textContent = lines.join("\\n\\n");
              }
              report();
              window.addEventListener("resize", report);
            `,
          }}
        />
      </body>
    </html>
  );
}
