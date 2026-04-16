import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export function useGamePoints() {
  const { refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  const submitScore = async (gameSlug, points, won = false) => {
    if (submitting || submitted) return;
    setSubmitting(true);
    try {
      await api.post('/points/submit', { gameSlug, points, won });
      await refreshUser();
      setSubmitted(true);
    } catch (err) {
      console.error('Score submit failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => setSubmitted(false);

  return { submitScore, submitting, submitted, reset };
}
