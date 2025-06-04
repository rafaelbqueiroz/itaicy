/**
 * Sprint 1 - CMS Authentication Routes
 * Handles login, logout, user management for the CMS
 */

import { Router } from 'express';
import { z } from 'zod';
import {
  authenticateUser,
  verifyToken,
  createCmsUser,
  getAllCmsUsers,
  updateCmsUser,
  deleteCmsUser,
  requireAuth
} from '../../services/auth';

const router = Router();

// Login schema
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

// Create user schema
const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  role: z.enum(['admin', 'editor', 'redator'], {
    errorMap: () => ({ message: 'Papel deve ser admin, editor ou redator' })
  }),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres')
});

// Update user schema
const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  role: z.enum(['admin', 'editor', 'redator']).optional(),
  active: z.boolean().optional()
});

/**
 * POST /api/cms/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const result = await authenticateUser(email, password);
    
    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      user: result.user,
      token: result.token
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * POST /api/cms/auth/verify
 * Verify JWT token and return user data
 */
router.post('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token de acesso requerido'
      });
    }

    const token = authHeader.substring(7);
    const user = await verifyToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido ou expirado'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * POST /api/cms/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', (req, res) => {
  // Since we're using JWT, logout is handled client-side by removing the token
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

/**
 * GET /api/cms/auth/users
 * Get all CMS users (admin only)
 */
router.get('/users', requireAuth('admin'), async (req, res) => {
  try {
    const users = await getAllCmsUsers();
    
    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuários'
    });
  }
});

/**
 * POST /api/cms/auth/users
 * Create new CMS user (admin only)
 */
router.post('/users', requireAuth('admin'), async (req, res) => {
  try {
    const userData = createUserSchema.parse(req.body);
    
    const result = await createCmsUser(userData);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(201).json({
      success: true,
      user: result.user,
      message: 'Usuário criado com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar usuário'
    });
  }
});

/**
 * PUT /api/cms/auth/users/:id
 * Update CMS user (admin only)
 */
router.put('/users/:id', requireAuth('admin'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de usuário inválido'
      });
    }

    const updates = updateUserSchema.parse(req.body);
    
    const updatedUser = await updateCmsUser(userId, updates);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      user: updatedUser,
      message: 'Usuário atualizado com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar usuário'
    });
  }
});

/**
 * DELETE /api/cms/auth/users/:id
 * Delete CMS user (admin only)
 */
router.delete('/users/:id', requireAuth('admin'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de usuário inválido'
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        error: 'Você não pode deletar sua própria conta'
      });
    }

    await deleteCmsUser(userId);

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar usuário'
    });
  }
});

/**
 * GET /api/cms/auth/me
 * Get current user profile
 */
router.get('/me', requireAuth(), async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;
