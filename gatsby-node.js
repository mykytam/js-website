const path = require(`path`);

const makeRequest = (graphql, request) => new Promise((resolve, reject) => {
 // Query for nodes to use in creating pages.
 resolve(
   graphql(request).then(result => {
     if (result.errors) {
       reject(result.errors)
     }
     return result;
   })
 )
});

// Implement the Gatsby API "createPages". This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
 const { createPage } = actions;

// Create pages for each blog.
 const getBlog = makeRequest(graphql, `
   {
     allContentfulBlog (
       sort: { fields: [createdAt], order: DESC }
       filter: {
         node_locale: {eq: "en-US"}},)
     {
       edges {
         node {
           id
           slug
         }
       }
     }
   }
   `).then(result => {
   result.data.allContentfulBlog.edges.forEach(({ node }) => {
     createPage({
       path: `blog/${node.slug}`,
       component: path.resolve(`src/templates/blog.js`),
       context: {
         id: node.id,
       },
     })
   })
});

// Create archive page for all blogs, including pagination
const getArchive = makeRequest(graphql, `
{
  allContentfulBlog (
    sort: { fields: [createdAt], order: DESC }
    filter: {
      node_locale: {eq: "en-US"}},)
  {
    edges {
      node {
        id
        slug
      }
    }
  }
}
`).then(result => { 
  const blogs = result.data.allContentfulBlog.edges // hold all of the blogs from Contentful
  const blogsPerPage = 9 // number of blogs 
  const numPages = Math.ceil(blogs.length / blogsPerPage) // calculate how many pages we need

  Array.from({ length: numPages }).forEach((_, i) => { // for each value we're going to create page
    createPage({ // create page API
      path: i === 0 ? `/blog` : `/blog/${i + 1}`, // path looks into the position of array and sets pages
      component: path.resolve("./src/templates/archive.js"), // tell where to pull a template
      context: { // allows to pass data into the component. so we can use that in Graphicul query
        limit: blogsPerPage, 
        skip: i * blogsPerPage, // requery each time graphicul
        numPages,
        currentPage: i + 1
      },
    })
  })
});

 return Promise.all([
   getBlog,
   getArchive
  ])
};
