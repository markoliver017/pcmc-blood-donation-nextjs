export function isOldEnoughToDonate(dateOfBirth, minimumAge = 17) {
    if (!dateOfBirth) return false;
    const today = new Date();
    const dob = new Date(dateOfBirth);

    const age = today.getFullYear() - dob.getFullYear();
    const hasBirthdayPassedThisYear =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
            today.getDate() >= dob.getDate());

    const realAge = hasBirthdayPassedThisYear ? age : age - 1;
    console.log("age", realAge);

    return realAge >= minimumAge;
}
