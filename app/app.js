import './i18n';
import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import createReducer from './redux/reducers';
import rootSaga from './redux/rootSaga';
import {
  AdminDashboard,
  Bonus,
  Dashboard,
  Login,
  NotFound,
  Pools,
  Profile,
  Settings,
  Tickets,
  User,
} from './containers/pageListAsync';
import ProtectedRoute from './ProtectedRoute';
import Payments from './containers/Payments';
import WalletTransactions from './containers/WalletTransactions';
import { Toaster } from 'react-hot-toast';
import WithdrawalRequest from './containers/WithdrawalRequest';

const sagaMiddleware = createSagaMiddleware();
const reducer = createReducer();
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
  devTools:
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
});

sagaMiddleware.run(rootSaga);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="user"
              element={
                <ProtectedRoute>
                  <User />
                </ProtectedRoute>
              }
            />

            <Route
              path="pools"
              element={
                <ProtectedRoute>
                  <Pools />
                </ProtectedRoute>
              }
            />
            <Route
              path="tickets"
              element={
                <ProtectedRoute>
                  <Tickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="payments"
              element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              }
            />
            <Route
              path="wallet-transactions"
              element={
                <ProtectedRoute>
                  <WalletTransactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="bonus"
              element={
                <ProtectedRoute>
                  <Bonus />
                </ProtectedRoute>
              }
            />
            <Route
              path="withdrawal-request"
              element={
                <ProtectedRoute>
                  <WithdrawalRequest />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
    </Provider>
  );
}

export default App;
