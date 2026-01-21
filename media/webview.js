// @ts-check

(function () {
  const vscode = acquireVsCodeApi();

  let currentRows = [];
  // State: { index: number, field: 'key' | 'value' } | null
  let editingState = null;

  // Listen for messages from the extension
  window.addEventListener('message', event => {
    const message = event.data;
    switch (message.type) {
      case 'renderRows':
        currentRows = message.rows;
        // If we were editing, reset edit state because data refreshed
        editingState = null;
        renderTable(currentRows);
        break;
    }
  });

  /**
   * Render the environment variables table
   */
  function renderTable(rows) {
    const tbody = document.getElementById('envTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    rows.forEach((row, index) => {
      const tr = document.createElement('tr');

      // Handle blank lines
      if (row.isBlank) {
        tr.className = 'blank-row';
        const td = document.createElement('td');
        td.colSpan = 2;
        td.innerHTML = '&nbsp;';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }

      // Handle comments
      if (row.isComment) {
        tr.className = 'comment-row';
        const td = document.createElement('td');
        td.colSpan = 2;
        td.textContent = row.key;
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }

      // --- Key Column ---
      const keyCell = document.createElement('td');
      keyCell.className = 'key-column';

      if (editingState && editingState.index === index && editingState.field === 'key') {
          // Edit Mode
          const input = document.createElement('input');
          input.value = row.key;
          setupInput(input, index, 'key');
          keyCell.appendChild(input);
      } else {
          // Display Mode
          const div = document.createElement('div');
          div.className = 'cell-content';
          div.textContent = row.key;
          div.onclick = () => startEditing(index, 'key');

          if (row.isDuplicate) {
              const warn = document.createElement('span');
              warn.className = 'duplicate-warning';
              warn.textContent = '⚠';
              warn.title = 'Duplicate key';
              div.appendChild(warn);
          }
          keyCell.appendChild(div);
      }
      tr.appendChild(keyCell);

      // --- Value Column ---
      const valueCell = document.createElement('td');
      valueCell.className = 'value-column';

      if (editingState && editingState.index === index && editingState.field === 'value') {
          // Edit Mode
          const input = document.createElement('input');
          input.value = row.value;
          setupInput(input, index, 'value');
          valueCell.appendChild(input);
      } else {
          // Display Mode
          const div = document.createElement('div');
          div.className = 'cell-content';
          if (row.displayValue === '******') {
              div.className += ' masked';
              div.textContent = '******';
          } else {
              div.textContent = row.value; // Always show raw value if short
          }
          div.onclick = () => startEditing(index, 'value');
          valueCell.appendChild(div);
      }
      tr.appendChild(valueCell);

      tbody.appendChild(tr);
    });
  }

  function setupInput(input, index, field) {
      setTimeout(() => input.focus(), 0);

      input.addEventListener('blur', () => {
          saveEdit(index, field, input.value);
      });
      input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
              input.blur();
          } else if (e.key === 'Escape') {
              cancelEdit();
          }
      });
  }

  function startEditing(index, field) {
      editingState = { index, field };
      renderTable(currentRows);
  }

  function cancelEdit() {
      editingState = null;
      renderTable(currentRows);
  }

  function saveEdit(index, field, newValue) {
      const row = currentRows[index];
      if (!row) return;

      // Optimistic update: Update local data and re-render immediately
      // This ensures the input disappears and masking is reapplied (if applicable)
      if (field === 'key') {
          row.key = newValue;
      } else {
          row.value = newValue;
          // Re-apply simple masking logic locally for the optimistic render
          // If length < 6, show value. If >= 6, show '******'.
          if (newValue.length < 6) {
              row.displayValue = newValue;
          } else {
              row.displayValue = '******';
          }
      }

      editingState = null;
      renderTable(currentRows);

      const newKey = field === 'key' ? newValue : row.key;
      const newVal = field === 'value' ? newValue : row.value;

      vscode.postMessage({
          type: 'updateEntry',
          lineIndex: row.lineIndex,
          newKey: newKey,
          newValue: newVal
      });
  }

})();
