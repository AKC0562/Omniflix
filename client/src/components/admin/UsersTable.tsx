// ===== Admin Users Table =====
// Modern data table with search, pagination, and row actions
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
  FiUser,
  FiAlertTriangle,
  FiX,
} from 'react-icons/fi';
import { useAdminStore } from '../../store/adminStore';
import type { AdminUser } from '../../types';

export default function UsersTable() {
  const {
    users,
    pagination,
    isLoadingUsers,
    isDeletingUser,
    searchQuery,
    fetchUsers,
    deleteUser,
    updateUserRole,
    setSearchQuery,
  } = useAdminStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [deleteModal, setDeleteModal] = useState<AdminUser | null>(null);

  // Initial fetch
  useEffect(() => {
    fetchUsers(1, '');
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        fetchUsers(1, localSearch);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, fetchUsers]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchUsers(page);
    },
    [fetchUsers]
  );

  const handleDelete = async () => {
    if (!deleteModal) return;
    await deleteUser(deleteModal._id);
    setDeleteModal(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-white tracking-wider">
            USER MANAGEMENT
          </h2>
          <p className="text-sm text-[#555] font-body mt-1">
            {pagination?.total || 0} total users registered
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FiSearch
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]"
          />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-xl pl-10 pr-4 py-3 font-body
                       placeholder:text-[#444] focus:outline-none focus:border-[#00ff88]/40
                       focus:shadow-[0_0_15px_rgba(0,255,136,0.08)] transition-all duration-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#2a2a2a] bg-[#111]/80 backdrop-blur-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="text-left text-xs font-display text-[#555] tracking-wider px-6 py-4 uppercase">
                User
              </th>
              <th className="text-left text-xs font-display text-[#555] tracking-wider px-6 py-4 uppercase">
                Email
              </th>
              <th className="text-left text-xs font-display text-[#555] tracking-wider px-6 py-4 uppercase">
                Role
              </th>
              <th className="text-left text-xs font-display text-[#555] tracking-wider px-6 py-4 uppercase">
                Profiles
              </th>
              <th className="text-left text-xs font-display text-[#555] tracking-wider px-6 py-4 uppercase">
                Joined
              </th>
              <th className="text-right text-xs font-display text-[#555] tracking-wider px-6 py-4 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoadingUsers ? (
              // Skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#1a1a1a]">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 rounded skeleton w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-[#555] font-body">
                  No users found
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {users.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/50 transition-colors duration-200 group"
                  >
                    {/* Username */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff88]/20 to-[#00cc6a]/10 flex items-center justify-center text-[#00ff88] text-xs font-display font-bold border border-[#00ff88]/20">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-white font-body font-medium group-hover:text-[#00ff88] transition-colors">
                          {user.username}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#888] font-body">
                        {user.email}
                      </span>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          updateUserRole(
                            user._id,
                            user.role === 'admin' ? 'user' : 'admin'
                          )
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display tracking-wider cursor-pointer transition-all duration-300 hover:scale-105
                          ${
                            user.role === 'admin'
                              ? 'bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30 hover:bg-[#a855f7]/25'
                              : 'bg-[#00ff88]/10 text-[#00ff88]/70 border border-[#00ff88]/20 hover:bg-[#00ff88]/20'
                          }`}
                        title={`Click to change role to ${user.role === 'admin' ? 'user' : 'admin'}`}
                      >
                        {user.role === 'admin' ? (
                          <FiShield size={12} />
                        ) : (
                          <FiUser size={12} />
                        )}
                        {user.role.toUpperCase()}
                      </button>
                    </td>

                    {/* Profile Count */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#888] font-body">
                        {user.profileCount}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#666] font-body">
                        {formatDate(user.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteModal(user)}
                        disabled={isDeletingUser === user._id}
                        className="p-2 rounded-lg text-[#555] hover:text-[#ff4444] hover:bg-[#ff4444]/10
                                   transition-all duration-300 cursor-pointer disabled:opacity-50"
                        title="Delete user"
                      >
                        <FiTrash2 size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 px-1">
          <p className="text-sm text-[#555] font-body">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#00ff88]/30
                         disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            >
              <FiChevronLeft size={16} />
            </button>
            {/* Page numbers */}
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-body transition-all duration-300 cursor-pointer
                    ${
                      pagination.page === pageNum
                        ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30'
                        : 'text-[#666] hover:text-white border border-transparent hover:border-[#2a2a2a]'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#00ff88]/30
                         disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Modal ─── */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-8 shadow-2xl"
            >
              {/* Warning icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#ff4444]/10 border border-[#ff4444]/20 flex items-center justify-center mx-auto mb-5">
                <FiAlertTriangle size={24} className="text-[#ff4444]" />
              </div>

              <h3 className="text-xl font-display font-bold text-white text-center tracking-wider mb-2">
                DELETE USER
              </h3>
              <p className="text-sm text-[#888] font-body text-center mb-6 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="text-[#ff4444] font-semibold">
                  {deleteModal.username}
                </span>
                ? This action cannot be undone. All profiles and data will be
                permanently removed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 py-3 rounded-xl border border-[#2a2a2a] text-[#888] font-body font-medium
                             hover:text-white hover:border-[#444] transition-all duration-300 cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  disabled={isDeletingUser !== null}
                  className="flex-1 py-3 rounded-xl bg-[#ff4444] text-white font-body font-medium
                             hover:bg-[#ff2222] shadow-[0_0_20px_rgba(255,68,68,0.2)]
                             disabled:opacity-50 transition-all duration-300 cursor-pointer"
                >
                  {isDeletingUser ? 'Deleting...' : 'Delete User'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
