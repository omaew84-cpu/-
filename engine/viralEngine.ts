import { supabase } from '@/lib/supabase';

export interface ViralShareData {
  score: number;
  riskLevel: string;
  deviceId: string;
  timestamp: number;
}

export async function generateReferralCode(userId?: string): Promise<string> {
  const code = `ref_${Math.random().toString(36).substring(2, 11)}`;
  return code;
}

export async function shareResult(
  result: ViralShareData,
  platform: 'native' | 'twitter' | 'email'
) {
  const score = result.score;
  const riskLevel = result.riskLevel;
  const shareText = `My privacy risk score is ${score}/100 (${riskLevel}). Check yours with Privacy Intelligence →`;
  const referralCode = await generateReferralCode();
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}?ref=${referralCode}`;

  if (platform === 'native' && navigator.share) {
    await navigator.share({
      title: 'Privacy Intelligence',
      text: shareText,
      url: shareUrl,
    });
  } else if (platform === 'twitter') {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  } else if (platform === 'email') {
    const mailtoUrl = `mailto:?subject=Check Your Privacy Risk&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.location.href = mailtoUrl;
  }

  return { code: referralCode, url: shareUrl };
}

export async function logReferral(
  referrerDeviceId: string,
  referrerUserId?: string
) {
  const { data, error } = await supabase.from('referrals').insert([
    {
      referrer_device_id: referrerDeviceId,
      referrer_id: referrerUserId,
      referral_code: await generateReferralCode(),
      status: 'pending',
    },
  ]);

  return { data, error };
}

export async function convertReferral(
  referralCode: string,
  newUserId: string
) {
  const { data, error } = await supabase
    .from('referrals')
    .update({
      new_user_id: newUserId,
      status: 'converted',
      converted_at: new Date().toISOString(),
    })
    .eq('referral_code', referralCode);

  return { data, error };
}

export async function getViralMetrics() {
  // Total referrals
  const { count: totalReferrals } = await supabase
    .from('referrals')
    .select('id', { count: 'exact', head: true });

  // Converted referrals
  const { count: convertedReferrals } = await supabase
    .from('referrals')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'converted');

  // Viral coefficient (referrals per user)
  const { count: totalUsers } = await supabase
    .from('user_profiles')
    .select('id', { count: 'exact', head: true });

  const viralCoefficient = totalUsers ? (totalReferrals || 0) / totalUsers : 0;

  return {
    totalReferrals: totalReferrals || 0,
    convertedReferrals: convertedReferrals || 0,
    conversionRate: totalReferrals ? ((convertedReferrals || 0) / totalReferrals) * 100 : 0,
    viralCoefficient,
  };
}
