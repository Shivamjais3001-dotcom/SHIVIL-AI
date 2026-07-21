export interface IEmailService {
  sendVerificationEmail(email: string, token: string, recipientName?: string): Promise<boolean>;
  sendPasswordResetEmail(email: string, token: string, recipientName?: string): Promise<boolean>;
  sendWelcomeEmail(email: string, recipientName: string): Promise<boolean>;
  sendSecurityAlertEmail(email: string, action: string, ipAddress?: string): Promise<boolean>;
}

export class EmailService implements IEmailService {
  /**
   * Dispatches an account verification email containing the one-time token link.
   */
  public async sendVerificationEmail(email: string, token: string, recipientName?: string): Promise<boolean> {
    const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verificationLink = `${appUrl}/verify-email?token=${token}`;

    console.log(`✉️ [EMAIL SERVICE ARCHITECTURE] Dispatching Email Verification:`);
    console.log(`   To: ${recipientName || email} <${email}>`);
    console.log(`   Link: ${verificationLink}`);
    
    // SMTP / AWS SES / SendGrid dispatch logic will be connected here
    return Promise.resolve(true);
  }

  /**
   * Dispatches a password reset email containing the recovery link.
   */
  public async sendPasswordResetEmail(email: string, token: string, recipientName?: string): Promise<boolean> {
    const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    console.log(`✉️ [EMAIL SERVICE ARCHITECTURE] Dispatching Password Reset Link:`);
    console.log(`   To: ${recipientName || email} <${email}>`);
    console.log(`   Link: ${resetLink}`);

    return Promise.resolve(true);
  }

  /**
   * Dispatches a welcome email upon successful email verification.
   */
  public async sendWelcomeEmail(email: string, recipientName: string): Promise<boolean> {
    console.log(`✉️ [EMAIL SERVICE ARCHITECTURE] Dispatching Welcome Email:`);
    console.log(`   To: ${recipientName} <${email}>`);

    return Promise.resolve(true);
  }

  /**
   * Dispatches security alert notifications for new logins or password changes.
   */
  public async sendSecurityAlertEmail(email: string, action: string, ipAddress?: string): Promise<boolean> {
    console.log(`✉️ [EMAIL SERVICE ARCHITECTURE] Security Alert Notification:`);
    console.log(`   To: ${email} | Action: ${action} | IP: ${ipAddress || "Unknown"}`);

    return Promise.resolve(true);
  }
}
