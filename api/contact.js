import formidable from 'formidable';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: false
  }
};

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['pdf', 'step', 'stp', 'dxf', 'dwg', 'zip', 'jpg', 'jpeg', 'png']);

const json = (response, statusCode, payload) => {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
};

const firstValue = (value) => {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
};

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const parseMultipart = (request) => new Promise((resolve, reject) => {
  const form = formidable({
    multiples: true,
    allowEmptyFiles: false,
    maxFileSize: MAX_FILE_SIZE,
    maxTotalFileSize: MAX_TOTAL_FILE_SIZE,
    filter: ({originalFilename}) => {
      if (!originalFilename) return false;
      const extension = originalFilename.split('.').pop()?.toLowerCase();
      return ALLOWED_EXTENSIONS.has(extension);
    }
  });

  form.parse(request, (error, fields, files) => {
    if (error) reject(error);
    else resolve({fields, files});
  });
});

const normalizeAttachments = (files) => Object.values(files)
  .flatMap((value) => Array.isArray(value) ? value : [value])
  .filter((file) => file && file.filepath && file.originalFilename)
  .map((file) => ({
    filename: file.originalFilename,
    path: file.filepath,
    contentType: file.mimetype || 'application/octet-stream'
  }));

const buildMessage = (fields, attachments) => {
  const name = firstValue(fields.name).trim();
  const company = firstValue(fields.bedrijf).trim();
  const email = firstValue(fields.email).trim();
  const phone = firstValue(fields.telefoon).trim();
  const type = firstValue(fields.aanvraag_type).trim();
  const process = firstValue(fields.materiaal_bewerking).trim();
  const planning = firstValue(fields.aantal_planning).trim();
  const message = firstValue(fields.message).trim();
  const pageUrl = firstValue(fields.page_url).trim();

  const rows = [
    ['Naam', name],
    ['Bedrijf', company],
    ['E-mail', email],
    ['Telefoon', phone],
    ['Onderwerp', type],
    ['Materiaal / bewerking', process],
    ['Aantal / planning', planning],
    ['Bericht', message],
    ['Pagina', pageUrl],
    ['Bijlagen', attachments.length ? attachments.map((item) => item.filename).join(', ') : 'Geen bijlagen']
  ];

  const text = rows.map(([label, value]) => `${label}: ${value || '-'}`).join('\n');
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111">
      <h2>Nieuwe aanvraag via Audacious.com</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:760px">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="border:1px solid #ddd;background:#f7f7f7;font-weight:bold;width:190px;vertical-align:top">${escapeHtml(label)}</td>
            <td style="border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value || '-')}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;

  return {name, email, type, text, html};
};

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP is niet geconfigureerd. Voeg SMTP_HOST, SMTP_PORT, SMTP_USER en SMTP_PASS toe in Vercel.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: {user, pass}
  });
};

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method !== 'POST') {
    json(response, 405, {success: false, message: 'Alleen POST is toegestaan.'});
    return;
  }

  try {
    const {fields, files} = await parseMultipart(request);

    if (firstValue(fields.botcheck)) {
      json(response, 200, {success: true});
      return;
    }

    const name = firstValue(fields.name).trim();
    const email = firstValue(fields.email).trim();
    const message = firstValue(fields.message).trim();

    if (!name || !email || !message) {
      json(response, 400, {success: false, message: 'Naam, e-mail en bericht zijn verplicht.'});
      return;
    }

    const attachments = normalizeAttachments(files);
    const mail = buildMessage(fields, attachments);
    const transporter = createTransporter();
    const to = process.env.CONTACT_TO || 'info@audacious.com';
    const from = process.env.CONTACT_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from,
      to,
      replyTo: mail.email || undefined,
      subject: `Nieuwe aanvraag via Audacious.com${mail.type ? ` - ${mail.type}` : ''}`,
      text: mail.text,
      html: mail.html,
      attachments
    });

    json(response, 200, {success: true, message: 'Aanvraag verzonden.'});
  } catch (error) {
    console.error('Audacious contact API:', error);
    json(response, 500, {
      success: false,
      message: error.message || 'De aanvraag kon niet worden verzonden.'
    });
  }
}
