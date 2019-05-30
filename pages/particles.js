import React from 'react';
import styled from 'styled-components';
import NextSEO from 'next-seo';
import ParticlesDemo from 'components/ParticlesDemo';

const ThreeParticles = () => (
  <>
    <NextSEO
      config={{
        title:
          '🔆 A 2D/3D particle library built on React, Three.js and WebGL | Tim Ellenberger',
        openGraph: {
          title:
            '🔆 A 2D/3D particle library built on React, Three.js and WebGL | Tim Ellenberger'
        }
      }}
    />
    <Container>
      <ParticlesDemo />
    </Container>
  </>
);

const fontColor = '#31d7f9';
const navFontColor = 'gainsboro';
const highlightFontColor = 'springgreen';
const backgroundColor = '#3b3f45';

// _app.js level theme variable overrides
ThreeParticles.theme = {
  headerNavFontColor: navFontColor,
  headerNavTextUnderlineColor: highlightFontColor,
  headerNavHoverFontColor: highlightFontColor,
  headerNavHamburgerIconColor: navFontColor,
  pageBackgroundColor: backgroundColor,
  pageContentFontColor: fontColor,
  pageContentLinkHoverColor: highlightFontColor
};

export default ThreeParticles;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: 100vh;
  user-select: none;
  background: #272727;
`;
