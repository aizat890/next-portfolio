import PropTypes from 'prop-types';
import styled from 'styled-components';
import PageScrollWrapper from 'components/PageScrollWrapper';
import HiringCallout from 'components/HiringCallout';
import BlogData from 'data/BlogPosts';
import BlogPostBanner from './components/BlogPostBanner';
import BlogPostSEO from './components/BlogPostSEO';
import BlogNavigation from './components/BlogNavigation';

const BlogPostLayout = ({ route, children, width }) => {
  // Get the current blog post from data
  const blogPost = BlogData.find(post => post.href === route);

  return (
    <>
      <BlogPostSEO route={route} blogPost={blogPost} />
      <PageScrollWrapper>
        <Container width={width}>
          <article>
            <header>
              <BlogPostBanner blogPost={blogPost} />
              <BlogNavigation route={route} />
            </header>
            <HorizontalRule />
            {children}
            <HorizontalRule />
            <BlogNavigation route={route} />
            <HiringCallout />
          </article>
        </Container>
      </PageScrollWrapper>
    </>
  );
};

BlogPostLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  route: PropTypes.string.isRequired,
  width: PropTypes.number
};

BlogPostLayout.defaultProps = {
  width: null
};

export default BlogPostLayout;

const HorizontalRule = styled.hr`
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    ${({ theme }) => theme.pageContentFontColor},
    rgba(0, 0, 0, 0)
  );
  margin: 2em 0;
`;

const Container = styled.main`
  color: ${({ theme }) => theme.pageContentFontColor};
  width: 100%;
  max-width: ${({ theme, width }) => width || theme.pageContentWidth}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1.5em;
  article {
    width: inherit;
  }
`;