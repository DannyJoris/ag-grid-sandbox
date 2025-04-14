import express from 'express';
import type { Request, Response } from 'express';

const router = express.Router();

// Fake user for demonstration
const FAKE_USER = {
  username: 'demo',
  password: 'password123'
};

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // Simple authentication check
  if (username === FAKE_USER.username && password === FAKE_USER.password) {
    // In a real app, you would generate a JWT token here
    res.json({ 
      success: true, 
      message: 'Authentication successful',
      user: { username: FAKE_USER.username }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

export default router; 