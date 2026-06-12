/**
 * Professional, source-aware copy for capability states.
 *
 * Replaces opaque "locked" / "not connected" badges with text that explains
 * *why* a feature is unavailable and what would unlock it. Client-safe
 * (no server imports) so settings panels and reader blocks can share it.
 */

import type { CapabilityFlag, CapabilityReasonCode } from '@/lib/types/capability';

/** Default professional copy per reason code. */
export function reasonCopy(reason: CapabilityReasonCode): string {
  switch (reason) {
    case 'available':
    case 'provider_field_present':
      return '';
    case 'provider_field_absent':
      return 'Not provided by the selected source.';
    case 'no_resources':
      return 'No resources are available from the current source.';
    case 'requires_verified_data':
      return 'Requires verified data before it can be enabled.';
    case 'requires_reviewed_source':
      return 'Awaiting a reviewed source entry.';
    case 'provider_unconfigured':
      return 'No content source is configured.';
    case 'probe_failed':
      return 'Could not confirm availability — retry loading.';
    default:
      return '';
  }
}

/** Best help text for a flag: its specific detail, else the reason default. */
export function flagHelp(flag: CapabilityFlag | undefined): string {
  if (!flag) return '';
  if (flag.available) return '';
  if (flag.detail) return flag.detail;
  return reasonCopy(flag.reason);
}

/** Short status label used on chips / option suffixes. */
export function flagBadge(flag: CapabilityFlag | undefined): string {
  if (!flag) return '';
  if (flag.available) return 'Available';
  switch (flag.reason) {
    case 'requires_verified_data':
      return 'Requires verified data';
    case 'requires_reviewed_source':
      return 'Awaiting reviewed source';
    case 'provider_field_absent':
      return 'Not in this source';
    case 'no_resources':
      return 'No sources';
    case 'provider_unconfigured':
      return 'Source not configured';
    case 'probe_failed':
      return 'Retry';
    default:
      return 'Unavailable';
  }
}
