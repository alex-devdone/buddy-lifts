import { describe, expect, test } from "bun:test";

import {
	generateInviteCode,
	type InviteCode,
	isValidInviteCode,
} from "../invite-code";

describe("Invite Code Generator", () => {
	describe("generateInviteCode", () => {
		test("generates an 8-character code", () => {
			const code = generateInviteCode();
			expect(code).toHaveLength(8);
		});

		test("generates unique codes on multiple calls", () => {
			const codes = new Set<string>();
			const iterations = 100;

			for (let i = 0; i < iterations; i++) {
				const code = generateInviteCode();
				codes.add(code);
			}

			// With ~2.8 trillion combinations, 100 codes should all be unique
			expect(codes.size).toBe(iterations);
		});

		test("generates codes using only the safe alphabet", () => {
			const safeAlphabet = new Set("23456789ABCDEFGHJKLMNPQRSTUVWXYZ");

			for (let i = 0; i < 100; i++) {
				const code = generateInviteCode();
				for (const char of code) {
					expect(safeAlphabet.has(char)).toBe(true);
				}
			}
		});

		test("excludes ambiguous characters (0, O, 1, I, l)", () => {
			const ambiguousChars = new Set(["0", "O", "1", "I", "l"]);

			for (let i = 0; i < 100; i++) {
				const code = generateInviteCode();
				for (const char of code) {
					expect(ambiguousChars.has(char)).toBe(false);
				}
			}
		});

		test("generates uppercase codes only", () => {
			for (let i = 0; i < 10; i++) {
				const code = generateInviteCode();
				expect(code).toBe(code.toUpperCase());
			}
		});
	});

	describe("isValidInviteCode", () => {
		describe("valid codes", () => {
			test("returns true for valid 8-character codes", () => {
				expect(isValidInviteCode("ABC23456")).toBe(true);
				expect(isValidInviteCode("23456789")).toBe(true);
				expect(isValidInviteCode("ABCDEFGH")).toBe(true);
				expect(isValidInviteCode("KLMNPQRS")).toBe(true);
			});

			test("accepts all characters from the safe alphabet", () => {
				const safeChars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

				// Test with each character at each position
				for (const char of safeChars) {
					const code = char.padEnd(8, "A");
					expect(isValidInviteCode(code)).toBe(true);
				}
			});

			test("accepts codes with mixed letters and numbers", () => {
				expect(isValidInviteCode("A2B4C6D8")).toBe(true);
				expect(isValidInviteCode("2A3B4C5D")).toBe(true);
				expect(isValidInviteCode("2K4M6N8P")).toBe(true);
			});
		});

		describe("invalid codes", () => {
			test("returns false for codes with wrong length", () => {
				expect(isValidInviteCode("")).toBe(false);
				expect(isValidInviteCode("ABC123")).toBe(false);
				expect(isValidInviteCode("ABC1234")).toBe(false); // 7 chars
				expect(isValidInviteCode("ABC123456")).toBe(false); // 9 chars
				expect(isValidInviteCode("A")).toBe(false);
			});

			test("returns false for codes with lowercase letters", () => {
				expect(isValidInviteCode("abc12345")).toBe(false);
				expect(isValidInviteCode("ABC1234a")).toBe(false);
				expect(isValidInviteCode("AbC12345")).toBe(false);
			});

			test("returns false for codes with special characters", () => {
				expect(isValidInviteCode("ABC-2345")).toBe(false);
				expect(isValidInviteCode("ABC_2345")).toBe(false);
				expect(isValidInviteCode("ABC@2345")).toBe(false);
				expect(isValidInviteCode("ABC#2345")).toBe(false);
				expect(isValidInviteCode("ABC!2345")).toBe(false);
			});

			test("returns false for codes with spaces", () => {
				expect(isValidInviteCode("ABC 2345")).toBe(false);
				expect(isValidInviteCode(" ABC2345")).toBe(false);
				expect(isValidInviteCode("ABC2345 ")).toBe(false);
			});

			test("returns false for codes with ambiguous characters", () => {
				expect(isValidInviteCode("ABC02345")).toBe(false); // Contains 0
				expect(isValidInviteCode("ABCO2345")).toBe(false); // Contains O
				expect(isValidInviteCode("ABC12345")).toBe(false); // Contains 1
				expect(isValidInviteCode("ABCI2345")).toBe(false); // Contains I
				expect(isValidInviteCode("ABCl2345")).toBe(false); // Contains l (lowercase L)
			});

			test("returns false for codes with numbers 0 or 1", () => {
				expect(isValidInviteCode("02345678")).toBe(false); // Starts with 0
				expect(isValidInviteCode("12345678")).toBe(false); // Starts with 1
				expect(isValidInviteCode("ABC01234")).toBe(false); // Contains 0 and 1
			});

			test("returns false for non-string input", () => {
				expect(isValidInviteCode(null as unknown as string)).toBe(false);
				expect(isValidInviteCode(undefined as unknown as string)).toBe(false);
				expect(isValidInviteCode(12345678 as unknown as string)).toBe(false);
			});
		});

		describe("edge cases", () => {
			test("returns false for null input", () => {
				expect(isValidInviteCode(null as unknown as string)).toBe(false);
			});

			test("returns false for undefined input", () => {
				expect(isValidInviteCode(undefined as unknown as string)).toBe(false);
			});

			test("returns false for empty string", () => {
				expect(isValidInviteCode("")).toBe(false);
			});

			test("returns false for whitespace only", () => {
				expect(isValidInviteCode("        ")).toBe(false);
			});

			test("returns false for codes with newlines", () => {
				expect(isValidInviteCode("ABC1234\n")).toBe(false);
				expect(isValidInviteCode("\nABC1234")).toBe(false);
			});
		});
	});

	describe("integration: generate and validate", () => {
		test("generated codes are valid", () => {
			for (let i = 0; i < 100; i++) {
				const code = generateInviteCode();
				expect(isValidInviteCode(code)).toBe(true);
			}
		});

		test("generated codes match the expected format", () => {
			const format = /^[2-9ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/;

			for (let i = 0; i < 100; i++) {
				const code = generateInviteCode();
				expect(format.test(code)).toBe(true);
			}
		});
	});

	describe("type safety", () => {
		test("InviteCode type is string", () => {
			const code: InviteCode = generateInviteCode();
			expect(typeof code).toBe("string");
		});
	});

	describe("character distribution", () => {
		test("generates codes with reasonable character distribution", () => {
			const charCounts = new Map<string, number>();
			const iterations = 1000;

			for (let i = 0; i < iterations; i++) {
				const code = generateInviteCode();
				for (const char of code) {
					charCounts.set(char, (charCounts.get(char) || 0) + 1);
				}
			}

			// All characters should appear at least a few times
			// with 1000 iterations of 8 chars each = 8000 total chars
			// Expected ~222 occurrences per character (8000 / 36)
			// Allow for some variance due to randomness
			const minOccurrences = 100; // Conservative lower bound
			const maxOccurrences = 400; // Conservative upper bound

			for (const [, count] of charCounts) {
				expect(count).toBeGreaterThanOrEqual(minOccurrences);
				expect(count).toBeLessThanOrEqual(maxOccurrences);
			}

			// Should have exactly 32 unique characters
			expect(charCounts.size).toBe(32);
		});
	});

	describe("real-world usage patterns", () => {
		test("handles typical invite code scenarios", () => {
			// Simulate generating codes for multiple training sessions
			const sessionCodes = new Map<string, string>();

			for (let i = 0; i < 50; i++) {
				const code = generateInviteCode();
				sessionCodes.set(`session-${i}`, code);

				// Each code should be valid
				expect(isValidInviteCode(code)).toBe(true);

				// Each code should be unique
				const uniqueCodes = new Set(sessionCodes.values());
				expect(uniqueCodes.size).toBe(i + 1);
			}
		});

		test("prevents ambiguous character confusion", () => {
			const ambiguousPairs = [
				["0", "O"],
				["1", "I"],
				["1", "l"],
				["O", "0"],
				["I", "1"],
				["l", "1"],
			];

			for (let i = 0; i < 100; i++) {
				const code = generateInviteCode();

				for (const [ambiguous1, ambiguous2] of ambiguousPairs) {
					// Code should never contain either character from ambiguous pairs
					expect(code).not.toContain(ambiguous1);
					expect(code).not.toContain(ambiguous2);
				}
			}
		});
	});
});
