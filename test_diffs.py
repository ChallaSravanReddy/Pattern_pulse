# Test PR Diffs to evaluate the reviewer

PR_DIFF_PRISMA_VIOLATION = """
diff --git a/app/actions/update-user-profile.ts b/app/actions/update-user-profile.ts
new file mode 100644
index 0000000..f3b891a
--- /dev/null
+++ b/app/actions/update-user-profile.ts
@@ -0,0 +1,24 @@
+'use server';
+
+import { prisma } from '@/lib/prisma';
+
+export async function updateUserProfile(userId: string, data: { bio: string; displayName: string }) {
+  try {
+    // Direct Prisma update inside Next.js Server Action
+    const updatedUser = await prisma.user.update({
+      where: { id: userId },
+      data: {
+        bio: data.bio,
+        displayName: data.displayName,
+      },
+    });
+
+    return { success: true, user: updatedUser };
+  } catch (error) {
+    console.error('Failed to update user profile in DB:', error);
+    return { success: false, message: 'Database update failed' };
+  }
+}
"""

PR_DIFF_AUTH_VIOLATION = """
diff --git a/src/features/auth/useAuth.ts b/src/features/auth/useAuth.ts
new file mode 100644
index 0000000..8b21ca4
--- /dev/null
+++ b/src/features/auth/useAuth.ts
@@ -0,0 +1,17 @@
+import { useEffect } from 'react';
+
+export function useAuthSession(token: string) {
+  useEffect(() => {
+    if (token) {
+      // Storing authentication credentials directly
+      localStorage.setItem('auth_token', token);
+      localStorage.setItem('session_active', 'true');
+    }
+  }, [token]);
+
+  return {
+    isAuthenticated: !!localStorage.getItem('auth_token'),
+  };
+}
"""
