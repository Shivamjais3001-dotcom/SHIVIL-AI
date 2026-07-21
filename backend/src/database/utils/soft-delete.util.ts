export class SoftDeleteHelper {
  /**
   * Appends non-deleted condition (`deletedAt: null`) to Prisma where inputs.
   */
  public static whereNotDeleted<T extends Record<string, any>>(where?: T): T & { deletedAt: null } {
    return {
      ...(where || {}),
      deletedAt: null,
    } as T & { deletedAt: null };
  }

  /**
   * Generates timestamp payload for soft deletion.
   */
  public static softDeletePayload(): { deletedAt: Date; updatedAt: Date } {
    const now = new Date();
    return {
      deletedAt: now,
      updatedAt: now,
    };
  }

  /**
   * Generates payload to restore a soft-deleted record.
   */
  public static restorePayload(): { deletedAt: null; updatedAt: Date } {
    return {
      deletedAt: null,
      updatedAt: new Date(),
    };
  }
}
