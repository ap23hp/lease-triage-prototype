const triageEnquiry = require('./triage.js');

// Test 1: Basic category match — verifies a simple, single-level category
// (Disputes) is correctly matched using one of its keywords.
test('matches Disputes when text contains a dispute-specific phrase', () => {
  const result = triageEnquiry("I want to make a formal complaint about my landlord");
  expect(result.category).toBe("Disputes");
});

// Test 2: Sub-scenario match — verifies that within a category with
// sub-scenarios (Costs and charges), the correct specific sub-scenario
// is matched, not just the parent category.
test('matches the service charge sub-scenario within Costs and charges', () => {
  const result = triageEnquiry("my service charge went up");
  expect(result.category).toBe("Costs and charges");
  expect(result.nextStep).toContain("service charge was calculated");
});

// Test 3: Sub-scenario match, different category — verifies the same
// sub-scenario logic works correctly for a second category
// (Building management), not just the first one tested.
test('matches the fire safety sub-scenario within Building management', () => {
  const result = triageEnquiry("I'm worried about fire safety in my building");
  expect(result.category).toBe("Building management");
  expect(result.nextStep).toContain("fire risk assessment");
});

// Test 4: Fallback case — verifies that when no keyword matches anywhere,
// the function returns null rather than crashing or returning an
// incorrect result. This is what triggers the dropdown fallback in the UI.
test('returns null when no category matches', () => {
  const result = triageEnquiry("random unrelated text xyz");
  expect(result).toBeNull();
});

// Test 5: Overlap test — verifies the fix for a bug found
// during development, where the generic word "landlord" alone could
// incorrectly match the Disputes category. This text should NOT match
// any category, since it doesn't contain a specific enough keyword.
test('does not match any category for a generic mention of "landlord" alone', () => {
  const result = triageEnquiry("my landlord is nice");
  expect(result).toBeNull();
});