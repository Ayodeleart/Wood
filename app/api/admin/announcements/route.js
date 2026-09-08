import { NextResponse } from "next/server";
import webpush from "web-push";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const VAPID_PUBLIC_KEY =
  process.env.VAPID_PUBLIC_KEY || "BC73tPCUnIe2lzYWl_cpB3hp2R4CN5F3PM9Z6_kRIX7gC91pxowUlxdijQCM7X1mTxo7qrA9h32Rw3XgwBFWvjc";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "eFYRMQ5bfRXBaThfqSVUDDEAbZsLp3CJyNcjAx2lEcg";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:ayodeleart1@gmail.com";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export async function GET() {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ announcements: data || [] });
}

export async function POST(req) {
  const { title, body, url } = await req.json().catch(() => ({}));
  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Title and body are required." }, { status: 400 });
  }

  const admin = supabaseAdmin();
  const { data: subs, error: subsError } = await admin.from("push_subscriptions").select("*");
  if (subsError) return NextResponse.json({ error: subsError.message }, { status: 500 });

  const payload = JSON.stringify({ title: title.trim(), body: body.trim(), url: url?.trim() || "/" });
  const deadEndpoints = [];
  let sent = 0;

  await Promise.all(
    (subs || []).map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload);
        sent++;
      } catch (err) {
        // 404/410 = the subscription is gone (uninstalled, permissions revoked, etc.) — clean it up.
        if (err.statusCode === 404 || err.statusCode === 410) deadEndpoints.push(s.endpoint);
      }
    })
  );

  if (deadEndpoints.length) {
    await admin.from("push_subscriptions").delete().in("endpoint", deadEndpoints);
  }

  const { data: record } = await admin
    .from("announcements")
    .insert({ title: title.trim(), body: body.trim(), url: url?.trim() || null, sent_count: sent })
    .select()
    .single();

  return NextResponse.json({ ok: true, sent, total: subs?.length || 0, announcement: record });
}
