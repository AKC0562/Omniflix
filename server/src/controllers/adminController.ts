// ===== Admin Controller =====
// Handles all admin dashboard operations: stats, user management
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../utils/ApiResponse';

/**
 * GET /api/admin/stats
 * Returns platform-wide statistics for the admin dashboard
 */
export const getStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Run all aggregations in parallel for performance
    const [
      totalUsers,
      totalAdmins,
      totalProfiles,
      recentUsers,
      usersByMonth,
    ] = await Promise.all([
      // Total user count
      User.countDocuments(),
      // Total admin count
      User.countDocuments({ role: 'admin' }),
      // Total profiles across all users
      User.aggregate([
        { $project: { profileCount: { $size: '$profiles' } } },
        { $group: { _id: null, total: { $sum: '$profileCount' } } },
      ]),
      // Recent users (last 30 days)
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
      // Users registered per month (last 6 months)
      User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    res.json(new ApiResponse(200, {
      stats: {
        totalUsers,
        totalAdmins,
        totalProfiles: totalProfiles[0]?.total || 0,
        recentUsers,
        activeUsers: totalUsers, // All registered users are considered active
        usersByMonth: usersByMonth.map((entry: any) => ({
          month: `${entry._id.year}-${String(entry._id.month).padStart(2, '0')}`,
          count: entry.count,
        })),
      },
    }, 'Stats fetched successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 * Returns paginated list of all users with profile counts
 */
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || '';
    const skip = (page - 1) * limit;

    // Build search filter
    const filter: any = {};
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-refreshTokens')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    // Enrich with profile count
    const enrichedUsers = users.map((user: any) => ({
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      profileCount: user.profiles?.length || 0,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.json(new ApiResponse(200, {
      users: enrichedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, 'Users fetched successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/users/:id
 * Deletes a user by ID (cannot delete self)
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user?.userId === id) {
      throw new AppError('Cannot delete your own account', 400);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await User.findByIdAndDelete(id);

    res.json(new ApiResponse(200, { deletedUserId: id }, `User "${user.username}" has been deleted successfully`));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/users/:id/role
 * Updates a user's role (cannot change own role)
 */
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      throw new AppError('Invalid role. Must be "user" or "admin"', 400);
    }

    // Prevent admin from changing their own role
    if (req.user?.userId === id) {
      throw new AppError('Cannot change your own role', 400);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json(new ApiResponse(200, { user: user.toJSON() }, `User "${user.username}" role updated to "${role}"`));
  } catch (error) {
    next(error);
  }
};
