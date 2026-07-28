import assert from "node:assert/strict";
import test from "node:test";

import { containsBlockedLanguage } from "../api/guestbook.js";

test("allows ordinary guestbook content", () => {
  assert.equal(containsBlockedLanguage("Ada", "Lovely portfolio!"), false);
});

test("blocks profanity in a message", () => {
  assert.equal(containsBlockedLanguage("Visitor", "You are an asshole."), true);
});

test("blocks discriminatory slurs", () => {
  assert.equal(containsBlockedLanguage("Visitor", "You are a kike."), true);
});

test("blocks abusive author names", () => {
  assert.equal(containsBlockedLanguage("asshole", "Hello!"), true);
});

test("normalizes common leetspeak substitutions", () => {
  assert.equal(containsBlockedLanguage("Visitor", "You are an @ssh0le."), true);
});

test("normalizes punctuation-separated evasions", () => {
  assert.equal(
    containsBlockedLanguage("Visitor", "You are an a.s.s.h.o.l.e."),
    true,
  );
});

test("normalizes space-separated evasions", () => {
  assert.equal(
    containsBlockedLanguage("Visitor", "You are an a s s h o l e."),
    true,
  );
});

test("normalizes accents and stretched characters", () => {
  assert.equal(
    containsBlockedLanguage("Visitor", "You are an ásssholé."),
    true,
  );
});

test("uses whole-word matching to avoid common false positives", () => {
  assert.equal(
    containsBlockedLanguage("Ada", "A classical assessment of the project."),
    false,
  );
});
