export const processEnergy = (energy: number) => {
    if (energy >= 100) {
        return 20;
    } else if (energy >= 95) {
        return 20; 
    } else if (energy >= 90) {
        return 19;
    } else if (energy >= 85) {
        return 18;
    } else if (energy >= 80) {
        return 17;
    } else if (energy >= 75) {
        return 16;
    } else if (energy >= 70) {
        return 15;
    } else if (energy >= 65) {
        return 14;
    } else if (energy >= 60) {
        return 13;
    } else if (energy >= 55) {
        return 12;
    } else if (energy >= 50) {
        return 11;
    } else if (energy >= 45) {
        return 10;
    } else if (energy >= 40) {
        return 9;
    } else if (energy >= 35) {
        return 8;
    } else if (energy >= 30) {
        return 7;
    } else if (energy >= 25) {
        return 6;
    } else if (energy >= 20) {
        return 5;
    } else if (energy >= 15) {
        return 4;
    } else if (energy >= 10) {
        return 3;
    } else if (energy >= 5) {
        return 2;
    } else if (energy > 0 && energy <= 5) {
        return 1;
    } else {
        return 0;
    }
}