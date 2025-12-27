import { supabase } from '@/integrations/supabase/client';

export interface TwoFactorEnrollResponse {
  id: string;
  type: 'totp';
  totp: {
    qr_code: string;
    secret: string;
    uri: string;
  };
}

export interface TwoFactorFactor {
  id: string;
  friendly_name?: string;
  factor_type: 'totp';
  status: 'verified' | 'unverified';
  created_at: string;
  updated_at: string;
}

/**
 * Enroll a new TOTP factor for the current user
 */
export async function enrollTOTP(friendlyName: string = 'Authenticator App'): Promise<{
  data: TwoFactorEnrollResponse | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName,
    });

    if (error) {
      return { data: null, error };
    }

    return { data: data as TwoFactorEnrollResponse, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Verify and activate the TOTP factor
 */
export async function verifyTOTP(factorId: string, code: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

/**
 * Get all enrolled factors for the current user
 */
export async function getFactors(): Promise<{
  data: TwoFactorFactor[] | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase.auth.mfa.listFactors();

    if (error) {
      return { data: null, error };
    }

    return { data: data.totp as TwoFactorFactor[], error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Check if the user has 2FA enabled
 */
export async function isTwoFactorEnabled(): Promise<boolean> {
  const { data } = await getFactors();
  return data?.some(factor => factor.status === 'verified') ?? false;
}

/**
 * Get the current authentication assurance level
 */
export async function getAssuranceLevel(): Promise<{
  currentLevel: 'aal1' | 'aal2' | null;
  nextLevel: 'aal1' | 'aal2' | null;
  currentAuthenticationMethods: Array<{ method: string; timestamp: number }>;
}> {
  try {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (error || !data) {
      return { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] };
    }

    return data;
  } catch {
    return { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] };
  }
}

/**
 * Create a challenge for 2FA verification during login
 */
export async function createChallenge(factorId: string): Promise<{
  challengeId: string | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId,
    });

    if (error) {
      return { challengeId: null, error };
    }

    return { challengeId: data.id, error: null };
  } catch (error) {
    return { challengeId: null, error: error as Error };
  }
}

/**
 * Verify a challenge with the provided code
 */
export async function verifyChallengeWithCode(
  factorId: string,
  challengeId: string,
  code: string
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

/**
 * Unenroll (disable) a TOTP factor
 */
export async function unenrollTOTP(factorId: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase.auth.mfa.unenroll({
      factorId,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
