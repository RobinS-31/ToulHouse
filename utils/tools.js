/**
 * Formate un prix ("price") au format "de-DE".
 * @param {Number} price
 * @returns {string}
 */
export const priceFormatted = (price) => {
    return Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0
    }).format(price);
};

/**
 * Redimensionne l'image en conservant le ratio original.
 * @param {Number} srcWidth width of source image
 * @param {Number} srcHeight height of source image
 * @param {Number} maxWidth maximum available width
 * @param {Number} maxHeight maximum available height
 * @return {Object} { width, height }
 */
export const resizeImageFullscreen = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {
        width: `${srcWidth*ratio}px`,
        height: `${srcHeight*ratio}px`
    };
};
