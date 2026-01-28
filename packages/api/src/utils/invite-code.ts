/**
 * Invite Code Generator
 *
 * Generates unique 8-character invite codes using nanoid.
 * These codes are used for users to join training sessions.
 */

import { customAlphabet } from "nanoid";

/**
 * Alphabet without ambiguous characters (0/O, 1/I/l, etc.)
 * This makes codes easier to read and share
 */
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/**
 * Invite code type alias for type safety
 */
export type InviteCode = string;

/**
 * Generate a unique 8-character invite code
 * Provides ~2.8 trillion possible combinations (36^8)
 */
export const generateInviteCode = customAlphabet(
	ALPHABET,
	8,
) as () => InviteCode;

/**
 * Validate an invite code format
 * Returns true if the code matches the expected format
 */
export function isValidInviteCode(code: string): boolean {
	return /^[2-9ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(code);
}
