import React from 'react';
import { Link, graphql, navigate } from 'gatsby';
import { window } from 'browser-monads';
import Layout from '../components/layout';
import Nav from '../components/nav';
import SEO from '../components/seo';
import '../components/home/home.css';
import './archive.css';

import headerImg from '../images/general-header-image.jpg';

const Archive = (props) => {

    const blogContent = props.data.allContentfulBlog // throw blog content in this value
    const { currentPage, numPages } = props.pageContext // based on context
    const isFirst = currentPage === 1 // check if this is 1st page
    const isLast = currentPage === numPages // check is it's last page
    const prevPage = currentPage - 1 === 1 ? '/blog' : `/blog/${currentPage - 1}`
    const nextPage = `/blog/${currentPage + 1}`

    return (
        <Layout>
        <SEO title='Blog' keywords={['blog']} />
        <Nav />

        <header> 
            <div className='archive__section'>
                <div className='archive__hero' style={{backgroundImage: `url(${headerImg})`}}></div> 
                <div className='archive__nav'>
                    <Link to='/blog' className={window.location.href.indexOf('/blog') > 0 ? 'archive__nav--link selected' : 'archive__nav--link'}>All</Link> 
                </div>
            </div>
        </header>

        <div className='feed'>
            {blogContent.edges.map(edge => ( // access blog content
                <div key={edge.node.id} className='card'
                style={{
                    backgroundImage: `linear-gradient(
                    to bottom,
                    rgba(10,10,10,0) 0%,
                    rgba(10,10,10,0) 50%,
                    rgba(10,10,10,0.7) 100%),
                    url(${edge.node.featuredImage.fluid.src})`  
                }}
            onClick={() => navigate(`/blog/${edge.node.slug}`)} //navigate to blog location
            >
            <p className='card__title'>{edge.node.title}</p>
            </div>
            ))}
        </div>

        <div className='pagination'> 
            <div className='pagination__item'>
                {!isFirst && (
                    <Link to={prevPage} rel='prev'>
                        <div className='arrow__back'></div>
                    </Link>
                )}
            </div>
            <div className='pagination__item'>
                {!isLast && (
                    <Link to={nextPage} rel='next'>
                        <div className='arrow__next'></div>
                    </Link>
                )}
            </div>
        </div>

        </Layout>
    )
}

export default Archive

export const pageQuery = graphql` 
 query ArchiveQuery ($skip: Int!, $limit: Int!) { 
   allContentfulBlog(
       sort: { fields: [createdAt], order: DESC }
       filter: {
       node_locale: {eq: "en-US",}}
       skip: $skip
       limit: $limit
     ) {
     edges {
       node {
         id
         slug
         title
         createdAt
         featuredImage {
           fluid(maxWidth: 1200, quality: 85) {
             src
             ...GatsbyContentfulFluid
           }
         }
       }
     }
   }
 }
`
