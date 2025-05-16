# Multilingual Horoscope Application Specification

## Overview

This document outlines the detailed requirements to enhance an existing HTML/JavaScript-based Tamil horoscope application to support multiple languages (Tamil, English, Telugu, Hindi, Malayalam, Kannada).

---

## 1. Languages Supported

* **Default:** Tamil
* **Additional:** English, Telugu, Hindi, Malayalam, Kannada

---

## 2. Language Selection UI

* A dropdown menu at the top of the page
* Default selection: Tamil
* User selection should persist across sessions (stored using browser's `localStorage`).

---

## 3. Translation Scope

Translations will include:

* **Astrological terms:** Planet names, Nakshatra names, Dasha labels
* **UI Elements:** Headers, Labels, Buttons, Instructional texts
* **Error messages:** All user-facing error messages

---

## 4. Translation Files Structure

### File Storage

Translation files will be hosted alongside existing website files in the following structure:

```
/translations/
    en.json
    ta.json
    hi.json
    te.json
    ml.json
    kn.json
```

### JSON File Format

Each JSON file will follow a nested structure:

```json
{
  "planets": {
    "sun": "Sun",
    "moon": "Moon",
    "mars": "Mars"
  },
  "nakshatras": {
    "ashwini": "Ashwini",
    "bharani": "Bharani"
  },
  "dashas": {
    "vimshottari": "Vimshottari Dasha",
    "antar_dasha": "Antar Dasha"
  },
  "ui": {
    "headers": {
      "horoscope_report": "Horoscope Report"
    },
    "buttons": {
      "generate_report": "Generate Report",
      "reset": "Reset"
    },
    "instructions": {
      "select_date": "Please select date and time",
      "select_city": "Select your city"
    },
    "errors": {
      "invalid_date": "Please enter a valid date.",
      "location_not_found": "Location not found. Please select a different city."
    }
  }
}
```

---

## 5. Handling Missing Translations

* Missing translations will clearly display as placeholders, e.g., `[[missing_translation_key]]`.
* This helps the developer quickly identify and rectify missing translations.

---

## 6. Translation Loading Strategy

* All translation files will be loaded upfront during application startup.
* Ensure fast runtime language switching after initial load.
* Target modern browser environments only.

---

## 7. Loading Indicator

* Display a simple, elegant spinner centered on the screen while translation files load.
* Spinner appears if loading takes longer than the fade-in animation described below.

---

## 8. Error Handling and Retries

* Automatic retries: Up to **3 times** if initial loading fails.
* If loading continues to fail after retries, display a user-friendly alert/pop-up prompting a manual retry.

---

## 9. Translation Module (`translations.js`)

* Keep translation handling logic in a separate JavaScript module (`translations.js`).

### Public Methods:

* `setLanguage(langCode)`:

  * Switches the current language, updates `localStorage`, and refreshes UI.
* `getTranslation(keyPath)`:

  * Retrieves translation strings via nested keys (e.g., `ui.buttons.generate_report`).
* `getCurrentLanguage()`:

  * Returns currently active language code.

---

## 10. Documentation

* Clearly document the translation handling process in a separate file: `TRANSLATION_GUIDE.md`

**Documentation will include:**

* Adding/updating translations
* JSON file structure
* Error handling and fallback mechanisms

---

## 11. Visual Enhancement on Initial Load

* Display a provided splash-screen image upon initial loading.
* Initial screen will be white and smoothly fade into the provided image over exactly **1 second**.
* Translation loading occurs during this fade-in animation.

---

## Implementation Checklist (for Developer)

* [ ] Create translation JSON files
* [ ] Implement dropdown UI for language selection
* [ ] Store user language preference in `localStorage`
* [ ] Implement the custom translation loading module (`translations.js`)
* [ ] Handle missing translation cases clearly
* [ ] Develop a spinner/loading indicator UI
* [ ] Implement automatic retry logic with manual retry fallback
* [ ] Write `TRANSLATION_GUIDE.md` clearly documenting the workflow
* [ ] Implement splash-screen fade-in animation

---

This specification clearly outlines the multilingual functionality and ensures maintainability, simplicity, and a smooth user experience.


Please refer to CODE_PROMPTS.md for further hints
