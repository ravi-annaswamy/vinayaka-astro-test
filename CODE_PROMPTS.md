# LLM Coding Prompts for Multilingual Horoscope Application

This document contains structured, clearly defined coding prompts for iterative, test-driven development (TDD) of a multilingual horoscope application. Implement each prompt sequentially, thoroughly testing and integrating each step before moving forward.

---

## Chunk 1: Translation Infrastructure

### Prompt 1.1

Create initial JSON files (`ta.json`, `en.json`, `te.json`, `hi.json`, `ml.json`, `kn.json`) in the correct nested structure with sample translations clearly grouped by UI sections (planets, UI elements, etc.). Provide one JSON per language as templates.

### Prompt 1.2

Write JavaScript code that asynchronously loads these JSON translation files upfront (during initial page load). Test this thoroughly by loading all language JSON files correctly and verifying content retrieval.

---

## Chunk 2: Translation Management Module

### Prompt 2.1

Implement a `translations.js` module defining the `getTranslation(keyPath)` function. Test by retrieving a sample translation from loaded JSON files and logging it clearly in the console.

### Prompt 2.2

Extend the module to include `setLanguage(langCode)` and `getCurrentLanguage()` methods. Ensure changing the language updates internal state, persists to `localStorage`, and verify correctness by console logs and `localStorage` inspection.

---

## Chunk 3: Language Selection UI

### Prompt 3.1

Add a language dropdown at the top of the page defaulted to Tamil. Populate the dropdown dynamically from available JSON languages. Test that UI renders correctly.

### Prompt 3.2

Wire the dropdown to trigger the `setLanguage(langCode)` method upon selection change. Verify language choice persistence by refreshing the page and checking the stored value in `localStorage`.

---

## Chunk 4: UI Text Replacement

### Prompt 4.1

Replace one representative header, button, and error message currently in Tamil with calls to `getTranslation(keyPath)`. Validate proper text rendering and language switching dynamically.

### Prompt 4.2

Extend text replacement to all Tamil texts throughout the app, testing each screen to confirm translations appear correctly in the selected language. Verify missing translations appear clearly marked (e.g., `[[missing_translation]]`).

---

## Chunk 5: Loading and Error Handling

### Prompt 5.1

Create a simple spinner UI element centered on the screen. Display it initially during translation files loading. Verify correct display and removal upon loading completion.

### Prompt 5.2

Implement logic to automatically retry loading translation JSON files up to three times upon failure. Add robust console logging to monitor retries clearly.

### Prompt 5.3

Implement a fallback alert/pop-up prompting the user to retry manually if automatic retries fail. Clearly test and confirm functionality by intentionally simulating network errors or missing files.

---

## Chunk 6: Visual Enhancement

### Prompt 6.1

Add provided splash-screen image to HTML and style it using CSS to cover the page initially. Ensure initial display shows only a solid white screen.

### Prompt 6.2

Implement CSS fade-in transition (from white to provided image) exactly over 1 second. Trigger fade-in upon page load, verify timing and visual smoothness thoroughly.

### Prompt 6.3

Integrate splash-screen fade-in animation with the spinner and translation loading logic. Confirm spinner appears only if loading exceeds 1 second; otherwise, gracefully transition to fully loaded UI.

---

## Chunk 7: Documentation

### Prompt 7.1

Write comprehensive Markdown documentation (`TRANSLATION_GUIDE.md`) clearly describing the translation file format, how to add/update translations, and handling errors and missing translations. Review carefully for clarity and completeness.

---

## Implementation Notes for Developer:

* Implement each prompt using Test-Driven Development (TDD).
* Validate thoroughly at each step before proceeding.
* Maintain clear console logs for debugging and verification.
* Ensure incremental integration and avoid leaving orphaned code.

Following this structured approach ensures a robust, maintainable, and user-friendly multilingual horoscope application.
