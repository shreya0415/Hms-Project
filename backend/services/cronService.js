import cron from 'node-cron';
import appointmentModel from '../model/appointmentModel.js';
import { sendReminderEmail } from './emailService.js';

const parseAppointmentDate = (slotDate, slotTime) => {
    const [day, month, year] = slotDate.split('_').map(Number);
    const [time, modifier] = slotTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes);
};

export const initReminderCron = () => {
    cron.schedule('*/10 * * * *', async () => {
        try {
            const now = new Date();
            const activeAppointments = await appointmentModel.find({
                cancelled: false,
                isCompleted: false,
                $or: [{ reminder24hSent: false }, { reminder1hSent: false }]
            });

            for (const appt of activeAppointments) {
                const apptDate = parseAppointmentDate(appt.slotDate, appt.slotTime);
                const diffMs = apptDate.getTime() - now.getTime();
                const diffHours = diffMs / (1000 * 60 * 60);

                if (diffHours <= 24 && diffHours > 1 && !appt.reminder24hSent) {
                    await sendReminderEmail(appt, '24h');
                    await appointmentModel.findByIdAndUpdate(appt._id, { reminder24hSent: true });
                }

                if (diffHours <= 1 && diffHours > 0 && !appt.reminder1hSent) {
                    await sendReminderEmail(appt, '1h');
                    await appointmentModel.findByIdAndUpdate(appt._id, { reminder1hSent: true });
                }
            }
        } catch (error) {
            console.error('Error executing reminder cron:', error);
        }
    });
};