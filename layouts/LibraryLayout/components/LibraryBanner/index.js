import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ProjectBadge, ProjectBadgeList } from 'components/Portfolio';
import { BlogLink } from 'components/Blog';

const LibraryBanner = ({ library }) => (
  <BannerContainer>
    <LibraryName>{library.name}</LibraryName>
    <LinkContainer>
      <StyledLink href={library.repoUrl}>GitHub</StyledLink>
      {library.demoLinks.map(link => (
        <StyledLink href={link.href} key={link.href}>
          {link.title}
        </StyledLink>
      ))}
    </LinkContainer>
    <ProjectBadgeList style={{ textAlign: 'center' }}>
      {library.badges.map(({ badgeUrl, linkUrl }) => (
        <ProjectBadge key={badgeUrl} badgeUrl={badgeUrl} linkUrl={linkUrl} />
      ))}
    </ProjectBadgeList>
    <ProjectDescription>{library.description}</ProjectDescription>
  </BannerContainer>
);

LibraryBanner.propTypes = {
  library: PropTypes.shape({
    href: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    repoUrl: PropTypes.string.isRequired,
    demoLinks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired
      })
    ).isRequired,
    badges: PropTypes.arrayOf(
      PropTypes.shape({
        badgeUrl: PropTypes.string.isRequired,
        linkUrl: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

export default LibraryBanner;

const ProjectDescription = styled.p`
  margin: 2em 0 0 0;
`;

const LinkContainer = styled.div`
  margin: 1em 0 0.5em 0;
  > * {
    margin-right: 1em;
  }
`;

const StyledLink = styled(BlogLink)`
  font-weight: normal;
  font-size: 1.1em;
`;

const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.pageBackgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 8px;
`;

const LibraryName = styled.h1`
  font-size: 3em;
  font-weight: normal;
  margin-bottom: 0;
  text-align: center;
`;
