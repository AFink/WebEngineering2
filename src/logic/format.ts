export function reverseGeocodeToCity(reversed: any) {
    return reversed.address.city ?? reversed.address.town ?? reversed.address.village ?? '';
}