import appointmentModel from '../model/appointmentModel.js';

export const calculateNoShowRisk = async ({ userId, slotDate, isPaid, docId }) => {
    const pastAppts = await appointmentModel.find({ userId, isCompleted: true });
    const pastNoShows = pastAppts.filter(appt => appt.noShow === true).length;
    const historyRate = pastAppts.length > 0 ? (pastNoShows / pastAppts.length) : 0.15;

    const [day, month, year] = slotDate.split('_').map(Number);
    const appointmentDateObj = new Date(year, month - 1, day);
    const today = new Date();
    
    const leadTimeDays = Math.max(0, Math.round((appointmentDateObj - today) / (1000 * 60 * 60 * 24)));
    const dayOfWeek = appointmentDateObj.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6) ? 1 : 0;
    const isUnpaid = isPaid ? 0 : 1;

    const z = -2.10 + (0.04 * leadTimeDays) + (2.80 * historyRate) + (0.90 * isUnpaid) + (0.50 * isWeekend);
    const score = 1 / (1 + Math.exp(-z));
    const roundedScore = Number(score.toFixed(2));

    let risk = 'LOW';
    if (roundedScore >= 0.65) {
        risk = 'HIGH';
    } else if (roundedScore >= 0.35) {
        risk = 'MEDIUM';
    }

    return { score: roundedScore, risk };
};