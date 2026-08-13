import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Eye, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle,
  X
} from 'lucide-react';
import { EmailLog } from '../types';

interface EmailNotificationsModuleProps {
  emailLogs: EmailLog[];
  onSendTestEmail: (recipientEmail: string, recipientName: string, subject: string, bodyHtml: string) => Promise<void>;
}

export const EmailNotificationsModule: React.FC<EmailNotificationsModuleProps> = ({
  emailLogs,
  onSendTestEmail,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);

  // Send Custom Test Email Form State
  const [testEmail, setTestEmail] = useState('cliente.prueba@gmail.com');
  const [testName, setTestName] = useState('Cliente de Prueba');
  const [testSubject, setTestSubject] = useState('¡Tu pedido PED-2026-0100 ha sido registrado!');
  const [testTemplate, setTestTemplate] = useState('order_created');
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('');
    setIsSending(true);

    const sampleBody = `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
        <h2 style="color: #2563eb; margin-top: 0;">¡Hola ${testName}!</h2>
        <p>Este es un correo de prueba enviado desde la plataforma de logística LogiExpress Perú.</p>
        <div style="background: #ffffff; padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Asunto:</strong> ${testSubject}</p>
          <p style="margin: 0 0 8px 0;"><strong>Código de Rastreo:</strong> TRK-${Math.floor(10000 + Math.random() * 90000)}</p>
          <p style="margin: 0;"><strong>Fecha de Envío:</strong> ${new Date().toLocaleString('es-PE')}</p>
        </div>
        <p style="font-size: 12px; color: #64748b;">Notificación automática enviada con éxito.</p>
      </div>
    `;

    try {
      await onSendTestEmail(testEmail, testName, testSubject, sampleBody);
      setStatusMsg('¡Correo de prueba enviado con éxito! Se ha registrado en el historial.');
    } catch (err: any) {
      setStatusMsg(`Error al enviar: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span>Módulo de Notificaciones por Correo Electrónico</span>
            <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full border border-blue-200">
              {emailLogs.length} Correos Enviados
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registro auditable de correos automáticos enviados a los clientes por cambios de estado de sus pedidos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Email Logs Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Historial de Correos Disparados</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Fecha / Hora</th>
                  <th className="py-3 px-4">Destinatario</th>
                  <th className="py-3 px-4">Asunto / Tipo</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Ver HTML</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {emailLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No hay correos registrados todavía.
                    </td>
                  </tr>
                ) : (
                  emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(log.sentAt).toLocaleString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{log.recipientName}</div>
                        <div className="text-[11px] text-slate-500">{log.recipientEmail}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium truncate max-w-[200px]">{log.subject}</div>
                        <span className="text-[10px] text-blue-600 font-mono">
                          {log.trackingCode}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Enviado</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedEmail(log)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors flex items-center space-x-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Previsualizar</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Send Test Custom Email Box */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center space-x-1.5">
              <Send className="w-4 h-4" />
              <span>Simulador de Envío de Correo</span>
            </h3>

            {statusMsg && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
                <span>{statusMsg}</span>
              </div>
            )}

            <form onSubmit={handleSendTest} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Destinatario</label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Asunto del Correo *</label>
                <input
                  type="text"
                  required
                  value={testSubject}
                  onChange={(e) => setTestSubject(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs shadow-xs disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Enviando Correo...' : 'Probar Envío de Correo'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* HTML Email Preview Drawer/Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-xl text-slate-800 overflow-hidden flex flex-col">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
              <div>
                <h2 className="text-base font-bold text-slate-900">Vista Previa de Correo Enviado</h2>
                <p className="text-xs text-slate-500">Para: {selectedEmail.recipientName} ({selectedEmail.recipientEmail})</p>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-white text-slate-900 min-h-[300px]">
              <div dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }} />
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedEmail(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
              >
                Cerrar Vista Previa
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
