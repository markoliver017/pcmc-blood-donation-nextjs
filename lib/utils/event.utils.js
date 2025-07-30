export const getFeedbackAverage = (donors) => {
    if (!donors?.length) return 0;
    let total = 0;
    const donorsFeedback = donors.filter(
        (donor) => donor.feedback_average !== null
    );
    if (!donorsFeedback?.length) return 0;
    donorsFeedback.forEach((donor) => {
        total += donor.feedback_average;
    });
    return total / donorsFeedback.length;
};

export const getFeedbackQuestionResponseAverage = (responses) => {
    if (!responses || !responses?.length) return 0;
    let total = 0;
    responses.forEach((response) => {
        total += response.rating;
    });
    return total / responses.length;
};
