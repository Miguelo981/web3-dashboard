export function getSimplifiedAddress(address: string, amount?: number) {
    if (!address || address.length < 1) return address;
    
    return address.slice(0, amount || 6) + '...' + address.slice(address.length - 4, address.length)
}