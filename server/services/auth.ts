/**
 * Sprint 1 - Authentication Service
 * Handles JWT/Supabase Auth integration with CMS user roles
 */

import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { cmsUsers } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { env, getSupabaseConfigOrNull } from '../config/environment';

const jwtSecret = env.config.SESSION_SECRET;
const supabaseConfig = getSupabaseConfigOrNull();

// Log authentication mode on startup
if (supabaseConfig) {
  console.log('🔐 Authentication: Supabase configured');
} else {
  if (env.isDevelopment) {
    console.log('🔧 Authentication: Development mode (mock auth)');
  } else {
    console.error('❌ Authentication: Supabase not configured in production!');
  }
}

// Create Supabase admin client (only if credentials are properly configured)
const supabaseAdmin = supabaseConfig
  ? createClient(supabaseConfig.url, supabaseConfig.serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export interface CmsUserSession {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'redator';
  supabaseUserId?: string;
}

export interface AuthResult {
  success: boolean;
  user?: CmsUserSession;
  token?: string;
  error?: string;
}

/**
 * Authenticate user with email/password via Supabase or mock for development
 */
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    // Development mode: Use mock authentication if Supabase is not available
    if (!supabaseAdmin || env.isDevelopment) {
      console.log('🔧 Using mock authentication for development');

      // Mock users for development
      const mockUsers = [
        {
          id: 1,
          email: 'robson@itaicy.com.br',
          name: 'Robson Silva',
          role: 'admin' as const,
          password: 'itaicy123',
          active: true
        },
        {
          id: 2,
          email: 'editor@itaicy.com.br',
          name: 'Editor de Teste',
          role: 'editor' as const,
          password: 'itaicy123',
          active: true
        }
      ];

      const mockUser = mockUsers.find(u => u.email === email && u.password === password);

      if (!mockUser) {
        return {
          success: false,
          error: 'Credenciais inválidas'
        };
      }

      // Create session data
      const sessionUser: CmsUserSession = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        supabaseUserId: `mock-${mockUser.id}`
      };

      // Generate JWT token
      const token = jwt.sign(sessionUser, jwtSecret, { expiresIn: '24h' });

      return {
        success: true,
        user: sessionUser,
        token
      };
    }

    // Production mode: Use Supabase authentication
    // 1. Authenticate with Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: 'Credenciais inválidas'
      };
    }

    // 2. Find CMS user in our database
    const [cmsUser] = await db
      .select()
      .from(cmsUsers)
      .where(eq(cmsUsers.email, email))
      .limit(1);

    if (!cmsUser || !cmsUser.active) {
      return {
        success: false,
        error: 'Usuário não encontrado ou inativo no CMS'
      };
    }

    // 3. Update last login
    await db
      .update(cmsUsers)
      .set({
        lastLogin: new Date(),
        supabaseUserId: authData.user.id
      })
      .where(eq(cmsUsers.id, cmsUser.id));

    // 4. Create session data
    const sessionUser: CmsUserSession = {
      id: cmsUser.id,
      email: cmsUser.email,
      name: cmsUser.name,
      role: cmsUser.role as 'admin' | 'editor' | 'redator',
      supabaseUserId: authData.user.id
    };

    // 5. Generate JWT token
    const token = jwt.sign(sessionUser, jwtSecret, { expiresIn: '24h' });

    return {
      success: true,
      user: sessionUser,
      token
    };

  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Erro interno do servidor'
    };
  }
}

/**
 * Verify JWT token and return user session
 */
export async function verifyToken(token: string): Promise<CmsUserSession | null> {
  try {
    const decoded = jwt.verify(token, jwtSecret) as CmsUserSession;

    // Development mode: Use mock verification if Supabase is not available
    if (!supabaseAdmin || env.isDevelopment) {
      // Mock users for development
      const mockUsers = [
        {
          id: 1,
          email: 'robson@itaicy.com.br',
          name: 'Robson Silva',
          role: 'admin' as const,
          active: true
        },
        {
          id: 2,
          email: 'editor@itaicy.com.br',
          name: 'Editor de Teste',
          role: 'editor' as const,
          active: true
        }
      ];

      const mockUser = mockUsers.find(u => u.id === decoded.id);

      if (!mockUser || !mockUser.active) {
        return null;
      }

      return {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        supabaseUserId: `mock-${mockUser.id}`
      };
    }

    // Production mode: Verify user in database
    const [cmsUser] = await db
      .select()
      .from(cmsUsers)
      .where(eq(cmsUsers.id, decoded.id))
      .limit(1);

    if (!cmsUser || !cmsUser.active) {
      return null;
    }

    return {
      id: cmsUser.id,
      email: cmsUser.email,
      name: cmsUser.name,
      role: cmsUser.role as 'admin' | 'editor' | 'redator',
      supabaseUserId: cmsUser.supabaseUserId || undefined
    };

  } catch (error) {
    return null;
  }
}

/**
 * Create a new CMS user (admin only)
 */
export async function createCmsUser(userData: {
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'redator';
  password: string;
}): Promise<AuthResult> {
  try {
    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'Sistema de autenticação não configurado'
      };
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: 'Erro ao criar usuário no sistema de autenticação'
      };
    }

    // 2. Create user in CMS database
    const [cmsUser] = await db
      .insert(cmsUsers)
      .values({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        supabaseUserId: authData.user.id,
        active: true
      })
      .returning();

    return {
      success: true,
      user: {
        id: cmsUser.id,
        email: cmsUser.email,
        name: cmsUser.name,
        role: cmsUser.role as 'admin' | 'editor' | 'redator',
        supabaseUserId: cmsUser.supabaseUserId || undefined
      }
    };

  } catch (error) {
    console.error('Create user error:', error);
    return {
      success: false,
      error: 'Erro ao criar usuário'
    };
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: CmsUserSession, requiredRole: 'admin' | 'editor' | 'redator'): boolean {
  const roleHierarchy = {
    'admin': 3,
    'editor': 2,
    'redator': 1
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

/**
 * Middleware to protect CMS routes
 */
export function requireAuth(requiredRole: 'admin' | 'editor' | 'redator' = 'redator') {
  return async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de acesso requerido' });
      }

      const token = authHeader.substring(7);
      const user = await verifyToken(token);

      if (!user) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
      }

      if (!hasRole(user, requiredRole)) {
        return res.status(403).json({ error: 'Permissão insuficiente' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Erro de autenticação' });
    }
  };
}

/**
 * Get all CMS users (admin only)
 */
export async function getAllCmsUsers() {
  return await db
    .select({
      id: cmsUsers.id,
      email: cmsUsers.email,
      name: cmsUsers.name,
      role: cmsUsers.role,
      active: cmsUsers.active,
      lastLogin: cmsUsers.lastLogin,
      createdAt: cmsUsers.createdAt
    })
    .from(cmsUsers)
    .orderBy(cmsUsers.createdAt);
}

/**
 * Update CMS user (admin only)
 */
export async function updateCmsUser(id: number, updates: Partial<{
  name: string;
  role: 'admin' | 'editor' | 'redator';
  active: boolean;
}>) {
  const [updatedUser] = await db
    .update(cmsUsers)
    .set({
      ...updates,
      updatedAt: new Date()
    })
    .where(eq(cmsUsers.id, id))
    .returning();

  return updatedUser;
}

/**
 * Delete CMS user (admin only)
 */
export async function deleteCmsUser(id: number) {
  // Get user to delete from Supabase Auth too
  const [user] = await db
    .select()
    .from(cmsUsers)
    .where(eq(cmsUsers.id, id))
    .limit(1);

  if (user?.supabaseUserId) {
    await supabaseAdmin.auth.admin.deleteUser(user.supabaseUserId);
  }

  await db
    .delete(cmsUsers)
    .where(eq(cmsUsers.id, id));

  return true;
}
