'use client';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import {client } from "../lib/client"
export const ApoloProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApolloProvider client={client}>
        {children}
    </ApolloProvider>
  );
};