import geoip from 'geoip-lite';

export interface Location {
    lat: number;
    lng: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLocationFromIP = (req: any): Location | null => {
    const ip =
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.connection.remoteAddress;

    if (!ip) return null;

    const geo = geoip.lookup(ip);

    if (geo?.ll) {
        return {lat: geo.ll[0], lng: geo.ll[1]};
    }

    return null;
};
