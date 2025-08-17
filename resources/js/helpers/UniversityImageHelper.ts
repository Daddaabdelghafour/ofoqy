/**
 * Get the image path for a university by ID
 * 
 * @param universityId The university ID
 * @returns The image path relative to public folder
 */
export const getUniversityImagePath = (universityId: number): string => {
    const images = getUniversityImagesMap();
    
    // Return the specific university image if it exists, otherwise return default
    return images[universityId] || 'images/Schools/default.png';
};

/**
 * Map of university IDs to their image paths
 * 
 * @returns A record mapping university IDs to image paths
 */
export const getUniversityImagesMap = (): Record<number, string> => {
    return {
        1: 'images/Schools/1.png',  // ENCG Meknès
        2: 'images/Schools/2.png',  // ENCG Casablanca
        3: 'images/Schools/3.png',  // ENCG Agadir
        4: 'images/Schools/4.png',  // ENCG Fès
        5: 'images/Schools/5.png',  // ENCG Tanger
        6: 'images/Schools/6.jpeg',  // ENCG Settat
        7: 'images/Schools/7.jpeg',  // ENCG Kénitra
        8: 'images/Schools/8.jpeg',  // ENCG Oujda
        9: 'images/Schools/9.png',  // ENCG Dakhla
        10: 'images/Schools/10.png', // ENCG El Jadida
        11: 'images/Schools/11.png', // ENSA Marrakech
        12: 'images/Schools/12.png', // ENSA Agadir
        13: 'images/Schools/13.png', // ENSA Fès
        14: 'images/Schools/14.png', // ENSA Tanger
        15: 'images/Schools/15.png', // ENSA Tétouan
        16: 'images/Schools/16.png', // ENSA Khouribga
        17: 'images/Schools/17.png', // ENSA Safi
        18: 'images/Schools/18.png', // ENSA El Jadida
        19: 'images/Schools/19.png', // ENSA Al Hoceima
        20: 'images/Schools/20.png', // ENSA Berrechid
        21: 'images/Schools/21.png', // EST Casablanca
        22: 'images/Schools/22.png', // EST Meknès
        23: 'images/Schools/23.png', // EST Fès
        24: 'images/Schools/24.png', // EST Agadir
        25: 'images/Schools/25.png', // EST Safi
        26: 'images/Schools/26.png', // EST Oujda
        27: 'images/Schools/27.png', // EST Beni Mellal
        28: 'images/Schools/28.png', // EST Laayoune
        29: 'images/Schools/29.png', // EST Guelmim
        30: 'images/Schools/30.png', // EST Salé
        31: 'images/Schools/31.png', // ENS Marrakech
        32: 'images/Schools/32.png', // Averroès Engineering School
        33: 'images/Schools/33.png', // Averroès Business School
        34: 'images/Schools/34.png', // Averroès Business School (different campus)
        35: 'images/Schools/35.png', // Droit Et Des Sciences Politiques De L'université Internationale Averroès
        36: 'images/Schools/36.png', // Faculty Of Medical Sciences
        37: 'images/Schools/37.png', // Mahir Center
        38: 'images/Schools/38.png', // School Of Hospitality Business & Management
        39: 'images/Schools/39.png', // School Of Collective Intelligence
        40: 'images/Schools/40.png', // De Sciences Et D'ingénierie - SSE Al Akhawayn
    };
};