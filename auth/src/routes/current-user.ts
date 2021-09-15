import express from 'express';

const router = express.Router();

router.get('/api/users/currentUser', () => {});

export { router as currentUserRouter };
