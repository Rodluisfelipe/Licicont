import { formatDateCO } from '../utils/generateToken.js';

interface EmailTemplateData {
  fullName: string;
  code: string;
  accessUrl: string;
  expiresAt: Date;
}

/**
 * Plantilla de email "Carta Sellada" — Dark-first con bordes dorados.
 * 100% inline CSS, table-based layout para compatibilidad máxima.
 */
export function invitationEmailTemplate(data: EmailTemplateData): string {
  const { fullName, code, accessUrl, expiresAt } = data;
  const expiryFormatted = formatDateCO(expiresAt);
  const firstName = fullName.split(' ')[0];

  return `
<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>LICICONT — Acceso Concedido</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0A192F;font-family:Georgia,'Times New Roman',serif;">
  
  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0A192F;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        
        <!-- Container -->
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#111111;border:1px solid #B89146;">
          
          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 28px;text-align:center;border-bottom:1px solid #B89146;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:6px;color:#B89146;text-transform:uppercase;text-align:center;padding-bottom:8px;">
                    Documento Confidencial
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Georgia,'Times New Roman',serif;font-size:32px;letter-spacing:10px;color:#B89146;text-align:center;font-weight:normal;">
                    LICICONT
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Georgia,'Times New Roman',serif;font-size:10px;letter-spacing:4px;color:#555555;text-transform:uppercase;text-align:center;padding-top:6px;">
                    Bróker de Licitaciones &bull; Colombia
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Decorative Line -->
          <tr>
            <td style="padding:0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:1px;background:linear-gradient(to right, transparent, #B89146, transparent);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#E8E8E8;">
                    Estimado/a <strong style="color:#B89146;">${firstName}</strong>,
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.8;color:#AAAAAA;">
                    Su solicitud de acceso a la plataforma LICICONT ha sido evaluada y aprobada. Se le ha asignado un código de acceso exclusivo que le permitirá ingresar al sistema de operaciones con el Estado.
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:12px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.8;color:#AAAAAA;">
                    Este privilegio es intransferible y tiene una ventana limitada de activación.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Code Badge -->
          <tr>
            <td align="center" style="padding:12px 40px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#0A192F;border:1px solid #B89146;padding:16px 36px;text-align:center;">
                    <span style="font-family:'Courier New',monospace;font-size:22px;letter-spacing:5px;color:#B89146;font-weight:bold;">
                      ${code}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding:4px 40px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#B89146;text-align:center;">
                    <a href="${accessUrl}" target="_blank" style="display:inline-block;padding:16px 52px;font-family:Georgia,'Times New Roman',serif;font-size:14px;letter-spacing:3px;text-decoration:none;color:#0A192F;font-weight:bold;text-transform:uppercase;">
                      Activar Acceso
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top:1px solid #222222;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Expiry Warning -->
          <tr>
            <td style="padding:24px 40px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Georgia,'Times New Roman',serif;font-size:12px;color:#B89146;text-align:center;letter-spacing:2px;text-transform:uppercase;">
                    &#9201; Ventana de Activación
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:8px;font-family:'Courier New',monospace;font-size:13px;color:#666666;text-align:center;">
                    Expira: ${expiryFormatted}
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:6px;font-family:Georgia,'Times New Roman',serif;font-size:12px;color:#444444;text-align:center;">
                    48 horas desde la emisión de este documento
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #1A1A1A;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Georgia,'Times New Roman',serif;font-size:11px;color:#333333;text-align:center;line-height:1.6;">
                    Este correo es confidencial y está dirigido exclusivamente a ${fullName}.<br>
                    Si no solicitó acceso a LICICONT, ignore este mensaje.<br><br>
                    <span style="color:#B89146;letter-spacing:2px;">LICICONT</span> &mdash; Bogotá, Colombia<br>
                    <span style="font-size:10px;color:#222222;">Ref: ${code}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Container -->
        
      </td>
    </tr>
  </table>
  <!-- /Wrapper -->

</body>
</html>`.trim();
}
