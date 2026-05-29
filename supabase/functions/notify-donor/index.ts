import webpush from 'npm:web-push';

const webpushModule = webpush as any;

webpushModule.setVapidDetails(
  'mailto:idabhinavx@protonmail.com',
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!
);

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;

    if (!record?.claim_code || !record?.donor_username) {
      return new Response('ok');
    }

    const { createClient } = await import('npm:@supabase/supabase-js');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ✅ Mark as Done — needy user ko notification bhejo
    if (payload.old_record?.claim_code) {
      const claimedBy = record?.claimed_by;
      if (!claimedBy) return new Response('no claimed_by');

      const { data: needyData } = await supabase
        .from('push_subscriptions'