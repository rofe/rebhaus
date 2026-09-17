/**
 * contact-form — the Kontakt page form. The heading is authored (one cell);
 * the fixed fields (Vorname / Nachname / E-Mail / Nachricht) are rendered by
 * the block. Submit builds a mailto:info@rebhaus.ch (dispositioned in
 * stardust/dynamic-features.md — no backend on EDS). CSP blocks inline
 * handlers, so the submit listener is wired here in block JS (#20).
 *
 * @ew-exempt <form> — fixed UI controls, not authored content (the heading is editable)
 * @param {Element} block
 */
const FIELDS = [
  {
    name: 'vorname', label: 'Vorname', placeholder: 'z. B. Emily', half: true,
  },
  {
    name: 'nachname', label: 'Nachname', placeholder: 'Nachname', half: true,
  },
  {
    name: 'email', label: 'E-Mail', placeholder: 'z. B. name@example.com', type: 'email',
  },
  {
    name: 'nachricht', label: 'Nachricht', placeholder: 'Ihre Nachricht', textarea: true,
  },
];

export default function decorate(block) {
  // MOVE the authored heading (EW1)
  const heading = block.querySelector('h1, h2, h3');
  block.textContent = '';
  const inner = document.createElement('div');
  inner.className = 'cf-inner';
  if (heading) inner.append(heading);

  const form = document.createElement('form');
  form.noValidate = true;
  const row = document.createElement('div');
  row.className = 'cf-row2';

  FIELDS.forEach((f) => {
    const wrap = document.createElement('div');
    wrap.className = 'cf-field';
    const label = document.createElement('label');
    label.setAttribute('for', `cf-${f.name}`);
    label.textContent = f.label;
    const input = document.createElement(f.textarea ? 'textarea' : 'input');
    input.id = `cf-${f.name}`;
    input.name = f.name;
    input.placeholder = f.placeholder;
    if (f.type) input.type = f.type;
    wrap.append(label, input);
    (f.half ? row : form).append(wrap);
    if (f.name === 'nachname') form.append(row);
  });

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'cf-send';
  submit.textContent = 'Senden';
  form.append(submit);

  // fallback note — mailto only opens a mail app if one is configured, so
  // surface the address (and pre-filled mailto link) after Senden is clicked
  const note = document.createElement('p');
  note.className = 'cf-note';
  note.hidden = true;
  form.append(note);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (n) => (form.elements[n]?.value || '').trim();
    const subject = `Kontakt via rebhaus.ch – ${v('vorname')} ${v('nachname')}`.trim();
    const body = `Name: ${v('vorname')} ${v('nachname')}\nE-Mail: ${v('email')}\n\n${v('nachricht')}`;
    const href = `mailto:info@rebhaus.ch?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    note.innerHTML = 'Ihre E-Mail-App sollte sich öffnen. Falls nicht, schreiben Sie uns direkt an '
      + `<a href="${href}">info@rebhaus.ch</a>.`;
    note.hidden = false;
  });

  inner.append(form);
  block.append(inner);
}
