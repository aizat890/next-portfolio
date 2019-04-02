import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import { Transition, animated } from 'react-spring/renderprops.cjs';
import StyledLogo from '../StyledLink';

class LeftSideLogo extends React.Component {
  static propTypes = {
    menuIsOpen: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    showBio: PropTypes.bool.isRequired
  };

  constructor() {
    super();
    this.state = {
      isHovering: false
    };
  }

  handleHover = isHovering => this.setState({ isHovering });

  render() {
    const { isHovering } = this.state;
    const { menuIsOpen, toggleMenu, showBio } = this.props;

    return (
      <LogoProfileContainer
        menuIsOpen={menuIsOpen}
        onMouseEnter={() => this.handleHover(true)}
        onMouseLeave={() => this.handleHover(false)}
        onFocus={() => this.handleHover(true)}
      >
        <LogoProfile>
          <Link prefetch href="/">
            <Logo
              menuIsOpen={menuIsOpen}
              onClick={() => menuIsOpen && toggleMenu()}
              isHovering={isHovering}
            >
              <MainHeading>Tim Ellenberger</MainHeading>
              <SubheadingContainer
                menuIsOpen={menuIsOpen}
                isHovering={isHovering}
              >
                <SubHeading>React</SubHeading>
                <SubHeading> | </SubHeading>
                <SubHeading>GraphQL</SubHeading>
                <SubHeading> | </SubHeading>
                <SubHeading>Consulting</SubHeading>
              </SubheadingContainer>
            </Logo>
          </Link>
        </LogoProfile>
        <Transition
          native
          items={(showBio && !menuIsOpen) || isHovering}
          initial={{ opacity: 0, height: '0px' }}
          from={{ opacity: 0, height: '0px' }}
          enter={{ opacity: 1, height: '400px' }}
          leave={{ opacity: 0, height: '0px' }}
        >
          {isOpen =>
            isOpen &&
            // eslint-disable-next-line react/prop-types
            (({ opacity, height }) => (
              <AnimatedContainer style={{ opacity, height }}>
                <AvatarImage src="/static/avatar.png" alt="avatar" />
                <StyledLink href="https://github.com/tim-soft" target="__blank">
                  GitHub: @tim-soft
                </StyledLink>
                <StyledLink href="mailto:timellenberger@gmail.com">
                  Email: Click to view
                </StyledLink>
                <BioParagraph>
                  I create super fast web apps with React and GraphQL
                </BioParagraph>
                {/* Emoji found with https://emojipedia.org/ */}
                <BioParagraph>
                  Made with{' '}
                  <span role="img" aria-label="love">
                    💚
                  </span>{' '}
                  in Seattle
                </BioParagraph>
              </AnimatedContainer>
            ))
          }
        </Transition>
      </LogoProfileContainer>
    );
  }
}

export default LeftSideLogo;

const MainHeading = styled.h1`
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
`;

const SubHeading = styled.h2`
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
`;

const BioParagraph = styled.div`
  color: white;
  margin: 10px;
  line-height: 21px;
  text-align: center;
  margin-top: auto;
`;

const StyledLink = styled.a`
  color: white;
  text-decoration: none;
  margin: 10px;
`;

const AvatarImage = styled.img`
  width: 90px;
  border-radius: 50%;
  margin: 20px;
`;

const LogoProfile = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 5px;
  width: 100%;
  height: inherit;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const SubheadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  margin: 0;
  padding: 0 12px;
  transition: color 0.2s linear;
  color: ${({ theme, menuIsOpen, isHovering }) => {
    if (menuIsOpen) return theme.headerNavMobileMenuFontColor;
    if (isHovering) return 'white';

    return theme.headerNavHamburgerIconColor;
  }};
`;

const Logo = styled(StyledLogo)`
  height: 60px;
  padding: 0;
  z-index: 21;
  font-size: 2.2em;
  ::before {
    top: 110%;
  }
  color: ${({ theme, menuIsOpen, isHovering }) => {
    if (menuIsOpen) return theme.headerNavMobileMenuFontColor;
    if (isHovering) return 'white';

    return theme.headerNavHamburgerIconColor;
  }};
  @media (${({ theme }) => theme.breakpoints.desktopNav}) {
    margin: 0;
  }
  @media (max-width: 400px) {
    font-size: 2em;
  }
  @media (max-width: 350px) {
    font-size: 1.9em;
  }
`;

const AnimatedContainer = animated(styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  padding-top: 66px;
  border-radius: 2%;
  background-color: #1a1a1aba;
  @media (max-width: 420px) {
    width: calc(100% - 10px);
    border-radius: 0;
  }
`);

const LogoProfileContainer = styled.main`
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${({ menuIsOpen }) => (menuIsOpen ? 22 : 'inherit')};
  width: 300px;
  padding: 10px;

  @media (max-width: 420px) {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    ${Logo} {
      align-self: flex-start;
    }
    ${LogoProfile} {
      max-width: 256px;
      padding: 15px 5px;
    }
    ${AnimatedContainer} {
      width: calc(100% - 10px);
      border-radius: 0;
    }
  }
`;
