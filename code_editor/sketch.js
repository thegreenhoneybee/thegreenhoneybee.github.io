import { CodeEditor } from './code_editor.js';

window.onload = function() {
  window.editor = CodeEditor.setup(document.querySelector('.textEditor'))
}
