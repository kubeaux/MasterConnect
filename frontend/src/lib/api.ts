const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const login = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/token/`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Identifiants incorrects');
    }

    const data = await response.json();
    
    const token = data.access || data.token || data.access_token;
    if (token) {
      localStorage.setItem('token', token);
    }
    
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};