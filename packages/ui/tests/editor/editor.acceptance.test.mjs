// One module graph gives every scenario the same browser lifecycle while Vitest still reports
// each behavioral guarantee independently.
import "./outline-keyboard.acceptance.mjs";
import "./outline-focus.acceptance.mjs";
import "./node-editor-regions.acceptance.mjs";
import "./node-editor-composition.acceptance.mjs";
import "./node-editor-lifecycle.acceptance.mjs";
import "./node-editor-capabilities.acceptance.mjs";
import "./outline-interaction.acceptance.mjs";
import "./outline-selection.acceptance.mjs";
import "./outline-host-commands.acceptance.mjs";
import "./outline-transactions.acceptance.mjs";
import "./outline-inline-editing.acceptance.mjs";
import "./outline-readonly.acceptance.mjs";
import "./suggestions.acceptance.mjs";
