let scriptPromise = null;

function loadPaystackScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.PaystackPop) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export async function openPaystackPopup({ email, amount, reference, onSuccess, onClose }) {
  await loadPaystackScript();
  const handler = window.PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email,
    amount,
    ref: reference,
    callback: (response) => onSuccess(response.reference),
    onClose,
  });
  handler.openIframe();
}
