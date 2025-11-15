/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// ride.service.ts
import {JwtPayload} from 'jsonwebtoken';
import {
    IRide,
    IRequestRidePayload,
    IRideHistoryFilters,
    RideStatus,
    IRideHistoryResponse,
} from './ride.interface';
import {User} from '../user/user.model';
import {Ride} from './ride.model';
import AppError from '../../errorHelpers/AppError';

const requestRide = async (
    decodedToken: JwtPayload,
    payload: IRequestRidePayload,
) => {
    const rider = await User.findById(decodedToken.userId);
    if (!rider) {
        throw new AppError(404, 'Rider not found');
    }

    // Validate locations
    if (
        !payload.pickupLocation?.coordinates ||
        !payload.dropoffLocation?.coordinates
    ) {
        throw new AppError(
            400,
            'Valid pickup and dropoff locations are required',
        );
    }

    const rideData: Partial<IRide> = {
        riderId: rider._id,
        pickupLocation: payload.pickupLocation,
        dropoffLocation: payload.dropoffLocation,
        paymentMethod: payload.paymentMethod,
        riderNote: payload.riderNote,
        fare: payload.fare,
    };

    const ride = await Ride.create(rideData);
    return await ride.populate('riderId', 'name phone rating');
};

const findRides = async (decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);

    if (!user || !user.currentLocation?.coordinates) {
        throw new Error('User not found or location not set');
    }

    const rides = await Ride.find({
        rideStatus: 'REQUESTED',
        pickupLocation: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: user.currentLocation.coordinates,
                },
                $maxDistance: 2000000,
            },
        },
    })
        .sort({createdAt: -1})
        .populate('riderId', 'name phone rating') // Populate rider details
        .limit(50); // Limit results

    return rides;
};

const getRideDetails = async (
    rideId: string,
    decodedToken: JwtPayload,
): Promise<IRide> => {
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(404, 'User not found');
    }

    const ride = await Ride.findById(rideId)
        .populate('riderId', 'name phone email')
        .populate('driverId', 'name phone rating totalRides vehicle')
        .lean();

    if (!ride) {
        throw new AppError(404, 'Ride not found');
    }

    // Check if user has permission to view this ride
    const userDoc = user as any;
    if (
        userDoc.role === 'RIDER' &&
        ride.riderId._id.toString() !== user._id.toString()
    ) {
        throw new AppError(403, 'Access denied');
    }
    if (
        userDoc.role === 'DRIVER' &&
        ride.driverId?._id.toString() !== user._id.toString()
    ) {
        throw new AppError(403, 'Access denied');
    }

    return ride;
};

const acceptRide = async (rideId: string, decodedToken: JwtPayload) => {
    const driver = await User.findById(decodedToken.userId);
    const driverDoc = driver as any;

    if (!driver || driverDoc.role !== 'DRIVER') {
        throw new AppError(403, 'Only drivers can accept rides');
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new AppError(404, 'Ride not found');
    }

    if (ride.rideStatus !== RideStatus.REQUESTED) {
        throw new AppError(400, 'Ride is no longer available');
    }

    ride.driverId = driver._id;
    ride.rideStatus = RideStatus.ACCEPTED;

    await ride.save();
    return await ride.populate(['riderId', 'driverId']);
};

const cancelRide = async (rideId: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(404, 'User not found');
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new AppError(404, 'Ride not found');
    }

    // Check permissions
    const isRider = (ride.riderId as any).toString() === decodedToken.userId;
    const isDriver =
        ride.driverId &&
        (ride.driverId as any).toString() === decodedToken.userId;

    if (!isRider && !isDriver) {
        throw new AppError(403, 'Access denied');
    }

    // Check if ride can be cancelled
    if (
        ride.rideStatus === RideStatus.COMPLETED ||
        ride.rideStatus === RideStatus.CANCELLED
    ) {
        throw new AppError(
            400,
            'Ride cannot be cancelled in its current state',
        );
    }

    // Riders can cancel before driver accepts, drivers can cancel after accepting
    if (isRider && ride.rideStatus !== RideStatus.REQUESTED) {
        throw new AppError(
            400,
            'Ride can only be cancelled before driver acceptance',
        );
    }

    ride.rideStatus = RideStatus.CANCELLED;
    ride.cancelledAt = new Date();
    ride.cancellationReason = isRider
        ? 'Cancelled by rider'
        : 'Cancelled by driver';

    await ride.save();
    return await ride.populate(['riderId', 'driverId']);
};

const getRideHistory = async (
    decodedToken: JwtPayload,
    filters: IRideHistoryFilters = {},
): Promise<IRideHistoryResponse> => {
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(404, 'User not found');
    }

    const {
        page = 1,
        limit = 10,
        search,
        startDate,
        endDate,
        minFare,
        maxFare,
        status,
    } = filters;

    // filter based on user role
    const filter: any = {};
    const userDoc = user as any;

    if (userDoc.role === 'RIDER') {
        filter.riderId = user._id;
    } else if (userDoc.role === 'DRIVER') {
        filter.driverId = user._id;
    }

    // Date range filter
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
            filter.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filter.createdAt.$lte = end;
        }
    }

    // Fare range filter
    if (minFare !== undefined || maxFare !== undefined) {
        filter.fare = {};
        if (minFare !== undefined) {
            filter.fare.$gte = Number(minFare);
        }
        if (maxFare !== undefined) {
            filter.fare.$lte = Number(maxFare);
        }
    }

    // Status filter - exclude 'ALL' status
    if (status && status !== 'ALL') {
        filter.rideStatus = status;
    }

    // Search filter (address search)
    if (search && search.trim() !== '') {
        filter.$or = [
            {'pickupLocation.address': {$regex: search, $options: 'i'}},
            {'dropoffLocation.address': {$regex: search, $options: 'i'}},
        ];
    }

    const skip = (page - 1) * limit;

    const [rides, total] = await Promise.all([
        Ride.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .populate('riderId', 'name phone')
            .populate('driverId', 'name phone')
            .lean(),
        Ride.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        rides,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages,
        },
    };
};

const getRideStats = async (decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(404, 'User not found');
    }

    // match filter based on role
    const matchFilter: any = {};
    const userDoc = user as any;

    if (userDoc.role === 'RIDER') {
        matchFilter.riderId = user._id;
    } else if (userDoc.role === 'DRIVER') {
        matchFilter.driverId = user._id;
    }

    const stats = await Ride.aggregate([
        {$match: matchFilter},
        {
            $group: {
                _id: null,
                totalRides: {$sum: 1},
                completedRides: {
                    $sum: {$cond: [{$eq: ['$rideStatus', 'COMPLETED']}, 1, 0]},
                },
                cancelledRides: {
                    $sum: {$cond: [{$eq: ['$rideStatus', 'CANCELLED']}, 1, 0]},
                },
                inProgressRides: {
                    $sum: {
                        $cond: [
                            {$in: ['$rideStatus', ['ACCEPTED', 'IN_PROGRESS']]},
                            1,
                            0,
                        ],
                    },
                },
                totalEarnings: {
                    $sum: {
                        $cond: [
                            {$eq: ['$rideStatus', 'COMPLETED']},
                            '$fare',
                            0,
                        ],
                    },
                },
                averageFare: {$avg: '$fare'},
            },
        },
    ]);

    // Default stats
    const defaultStats = {
        totalRides: 0,
        completedRides: 0,
        cancelledRides: 0,
        inProgressRides: 0,
        totalEarnings: 0,
        averageFare: 0,
    };

    return stats[0]
        ? {
              totalRides: stats[0].totalRides,
              completedRides: stats[0].completedRides,
              cancelledRides: stats[0].cancelledRides,
              inProgressRides: stats[0].inProgressRides,
              totalEarnings: stats[0].totalEarnings || 0,
              averageFare: Math.round(stats[0].averageFare || 0),
          }
        : defaultStats;
};

const getRecentRides = async (decodedToken: JwtPayload, limit = 5) => {
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(404, 'User not found');
    }

    // Build filter based on role
    const filter: any = {};
    const userDoc = user as any;

    if (userDoc.role === 'RIDER') {
        filter.riderId = user._id;
    } else if (userDoc.role === 'DRIVER') {
        filter.driverId = user._id;
    }

    const rides = await Ride.find(filter)
        .sort({createdAt: -1})
        .limit(limit)
        .populate('riderId', 'name phone')
        .populate('driverId', 'name phone')
        .select(
            'pickupLocation dropoffLocation fare rideStatus createdAt startedAt completedAt',
        )
        .lean();

    return rides;
};

const getMonthlyStats = async (
    decodedToken: JwtPayload,
    year = new Date().getFullYear(),
) => {
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(404, 'User not found');
    }

    // match filter based on role
    const matchFilter: any = {
        createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
        },
    };

    const userDoc = user as any;
    if (userDoc.role === 'RIDER') {
        matchFilter.riderId = user._id;
    } else if (userDoc.role === 'DRIVER') {
        matchFilter.driverId = user._id;
    }

    const monthlyStats = await Ride.aggregate([
        {$match: matchFilter},
        {
            $group: {
                _id: {$month: '$createdAt'},
                rideCount: {$sum: 1},
                totalFare: {$sum: '$fare'},
                completedRides: {
                    $sum: {$cond: [{$eq: ['$rideStatus', 'COMPLETED']}, 1, 0]},
                },
            },
        },
        {$sort: {_id: 1}},
    ]);

    // Fill in missing months with zero values
    const filledStats = [];
    for (let month = 1; month <= 12; month++) {
        const monthData = monthlyStats.find((stat) => stat._id === month);
        filledStats.push({
            month,
            monthName: new Date(year, month - 1).toLocaleString('default', {
                month: 'short',
            }),
            rideCount: monthData?.rideCount || 0,
            totalFare: monthData?.totalFare || 0,
            completedRides: monthData?.completedRides || 0,
        });
    }

    return filledStats;
};

export const RideService = {
    requestRide,
    findRides,
    acceptRide,
    cancelRide,
    getRideDetails,
    getRideHistory,
    getRideStats,
    getRecentRides,
    getMonthlyStats,
};
