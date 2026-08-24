import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendReminderEmail = async (appointment, type) => {
    const timeLabel = type === '24h' ? 'in 24 hours' : 'in 1 hour';
    
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: appointment.userData.email,
        subject: `Appointment Reminder: Your consultation is scheduled ${timeLabel}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #4F46E5;">Appointment Reminder</h2>
                <p>Hello <strong>${appointment.userData.name}</strong>,</p>
                <p>This is a reminder for your upcoming medical consultation.</p>
                <div style="background-color: #F3F4F6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Doctor:</strong> ${appointment.docData.name}</p>
                    <p style="margin: 5px 0;"><strong>Speciality:</strong> ${appointment.docData.speciality}</p>
                    <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${appointment.slotDate} at ${appointment.slotTime}</p>
                    <p style="margin: 5px 0;"><strong>Location:</strong> ${appointment.docData.address.line1}, ${appointment.docData.address.line2}</p>
                </div>
                <p>Please arrive 10 minutes prior to your scheduled time.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};