import { configureStore } from '@reduxjs/toolkit';

/**
 * Redux Store Configuration
 * Central state management for the application
 */
export const store = configureStore({
  reducer: {
    // Add reducers here as needed
    // Example: projects: projectsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['your/action/type'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Made with Bob
