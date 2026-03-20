// ===== Admin Routes =====
// All routes require authentication + admin role
import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getStats,
  getUsers,
  deleteUser,
  updateUserRole,
} from '../controllers/adminController';

const router = Router();

// All admin routes are protected: must be authenticated AND have admin role
router.use(authenticate);
router.use(authorize('admin'));

// GET /api/admin/stats — Dashboard statistics
router.get('/stats', getStats);

// GET /api/admin/users — Paginated user list (supports ?search=&page=&limit=)
router.get('/users', getUsers);

// DELETE /api/admin/users/:id — Delete a user
router.delete('/users/:id', deleteUser);

// PATCH /api/admin/users/:id/role — Update user role
router.patch('/users/:id/role', updateUserRole);

export default router;
