const assert = require("node:assert");
const test = require("node:test");
const { sanitizeSettings, DEFAULT_SETTINGS } = require("../settingsStore");

test("sanitizeSettings should return DEFAULT_SETTINGS for empty input", () => {
  const result = sanitizeSettings({});
  assert.strictEqual(result.launchOnStartup, DEFAULT_SETTINGS.launchOnStartup);
  assert.strictEqual(result.selectedTheme, DEFAULT_SETTINGS.selectedTheme);
  
  const expectedAmbientWave = {
    ...DEFAULT_SETTINGS.ambientWave,
    customColors: DEFAULT_SETTINGS.customColors,
    customSensitivity: 30
  };
  assert.deepStrictEqual(result.ambientWave, expectedAmbientWave);
});

test("sanitizeSettings should fallback to DEFAULT_SETTINGS.selectedTheme for invalid theme", () => {
  const result = sanitizeSettings({ selectedTheme: "invalidThemeName" });
  assert.strictEqual(result.selectedTheme, DEFAULT_SETTINGS.selectedTheme);
});

test("sanitizeSettings should parse launchOnStartup correctly", () => {
  let result = sanitizeSettings({ selectedTheme: "ambientWave", launchOnStartup: true });
  assert.strictEqual(result.launchOnStartup, true);

  result = sanitizeSettings({ selectedTheme: "ambientWave", launchOnStartup: "true" }); // Invalid type should fallback to default
  assert.strictEqual(result.launchOnStartup, false);
});



test("sanitizeSettings should sanitize inner theme objects", () => {
  const invalidAmbientWave = {
    tone: "invalidTone",
    sensitivity: "invalidSensitivity"
  };
  const result = sanitizeSettings({ selectedTheme: "ambientWave", ambientWave: invalidAmbientWave });
  assert.strictEqual(result.ambientWave.tone, DEFAULT_SETTINGS.ambientWave.tone);
  assert.strictEqual(result.ambientWave.sensitivity, DEFAULT_SETTINGS.ambientWave.sensitivity);
});

test("sanitizeSettings should migrate legacy settings correctly", () => {
  const legacySettings = {
    theme: "purple" // Legacy theme tone
  };
  const result = sanitizeSettings(legacySettings);
  assert.strictEqual(result.ambientWave.tone, "purple");
});
