import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import LibraryLayout from 'layouts/LibraryLayout';
import { darkTheme } from 'components/AppTheme';

const LibraryPage = ({ route, theme }) => (
  <ThemeProvider theme={theme}>
    <LibraryLayout route={route}>
      <p>A 2D/3D particle library built on React, Three.js and WebGL</p>
      <section>
        <h2>Test 1</h2>
      </section>
      <section>
        <h2>Test 2</h2>
      </section>
    </LibraryLayout>
  </ThemeProvider>
);

LibraryPage.propTypes = {
  route: PropTypes.string.isRequired,
  theme: PropTypes.object
};

LibraryPage.defaultProps = {
  theme: {}
};

LibraryPage.pageTheme = darkTheme;

export default LibraryPage;