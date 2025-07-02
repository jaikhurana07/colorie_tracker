export const calculateBMR = (
    gender: 'male' | 'female',
    weight: number,
    height: number,
    age: number
): number => {
    if (gender === 'male') {
        return 66.4730 + (13.7516 * weight) + (5.0033 * height) - (6.7550 * age);
    } else {
        return 655.0955 + (9.5634 * weight) + (1.8496 * height) - (4.6756 * age);
    }
};

export const calculateActivityCalories = (
    metValue: number,
    weight: number,
    durationInMinutes: number
): number => {
    return metValue * weight * (durationInMinutes / 60);
};
