import React, { useState, useCallback } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

interface LoginProps extends RouteComponentProps {
  // setUserInfo: (userInfo: UserState) => void;
}

interface FormProp {
  account?: string;
  mobile?: string;
  password?: string;
  code?: number;
}
function Login() {
  console.log('1');
}