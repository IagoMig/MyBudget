import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://fsgvoglemkbbzeedzpmu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ3ZvZ2xlbWtiYnplZWR6cG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NzUzNTcsImV4cCI6MjA3MjM1MTM1N30.75KRDcGfGQXHK6jgfP0bQpM8dtdy62XOZuji9JGug44';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for user-specific data
export const getUserData = async (table: string) => {
  const {
    data: sessionData
  } = await supabase.auth.getSession();
  if (!sessionData.session) return {
    data: null,
    error: new Error('Não autenticado')
  };
  const {
    data,
    error
  } = await supabase.from(table).select('*').eq('user_id', sessionData.session.user.id);
  return {
    data,
    error
  };
};
export const insertUserData = async (table: string, data: any) => {
  const {
    data: sessionData
  } = await supabase.auth.getSession();
  if (!sessionData.session) return {
    data: null,
    error: new Error('Não autenticado')
  };
  const {
    data: insertedData,
    error
  } = await supabase.from(table).insert([{
    ...data,
    user_id: sessionData.session.user.id
  }]);
  return {
    data: insertedData,
    error
  };
};