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

    // Sirf jab claim_code fill ho
    if (!record?.claim_code || !record?.donor_username) {
      return new Response('ok');
    }

    const { createClient } = await import('npm:@supabase/supabase-js');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('donor_username', record.donor_username)
      .single();

    if (!data?.subscription) return new Response('no subscription');

    await webpushModule.sendNotification(
      data.subscription,
      JSON.stringify({
        title: '🎉 Card Claimed!',
        body: `${record.give_card} claimed! Exchange code: ${record.claim_code}`,
        url: '/check'
      })
    );

    return new Response('sent');
  } catch(e) {
    console.error(e);
    return new Response('error', { status: 500 });
  }
});