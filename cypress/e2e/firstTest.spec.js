
describe('Tests with backend', () => {
    
    beforeEach('login to the app', ()=>{
        //I intercept method:
        // cy.intercept('GET',
        //               'https://api.realworld.io/api/tags',
        //               {fixture: 'tags.json'})

        cy.intercept({method: 'get', path: 'tags'}, {fixture: 'tags.json'})//II intercept method
        cy.loginToApplication(2000,2200)//command.gs loginToApplication set up
        
    })
    
  
it('Verify correct request and response (intercept) Lesson 39', () => {

          
        ////interception configured:
        cy.intercept('POST', Cypress.env('apiUrl')+'/api/articles/').as('postArticle')//apiUrl set up in cypress.config.js as var
        //in order to get request body and responce to check them 

        //making a call"
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('Title 1 intercept')
        cy.get('[formcontrolname="description"]').type('Nothing to do')
        cy.get('[formcontrolname="body"]').type('There is no evidence')
        cy.contains('Publish Article').click()

        cy.wait('@postArticle').then( xhr => {
            console.log(xhr)        //checking recponse on our calls and interceptions:
               
        expect(xhr.response.statusCode).to.equal(201)
        expect(xhr.request.body.article.title).to.equal('Title1 intercept')
        expect(xhr.request.method).to.equal('POST')
        //expect(xhr.body.article.description).to.equal('Nothing to do')
        })
        cy.contains('button', 'Delete Article').click()//clean up after test
          
    });
    
    
it('Verify tags and display', () => {
      cy.get('.tag-list').should('contain', 'cypress')/
                            .and('contain', 'welcome')
                            .and('contain', 'testing')
                            console.log('.tag-list')
     })

it('Verify Global Feed likes count 39', () => {
    cy.intercept('GET', 'https://api.realworld.io/api/articles/feed*', {"articles":[],"articlesCount":0})//navigation to the page, opening application first menu, so we need to intercept both
                    //(Method, url, response obj, second (bellow) were put in fixture articles.json and corrected as we nedded)
    cy.intercept('GET', 'https://api.realworld.io/api/articles*', {fixture: 'articles.json'})//fixture is method here not file fixtures, but articles.json - file

    cy.contains('Global Feed').click()    
   
    cy.get('app-article-list button').then(likeCounter => {
        console.log(likeCounter)
        expect(likeCounter[0]).to.contain('10')
        expect(likeCounter[1]).to.contain('5')
        
    })
    cy.fixture('articles').then(file => {
        const articlesLink = file.articles[1].slug//path to slug (second element)
        file.articles[1].favoritesCount = 6//path to counter, assigned it 51(previous value + 1 loke, so our click)
        console.log(file)
        cy.intercept('POST', 'https://api.realworld.io/api/articles/'+articlesLink+'/favorite, file')//as usual - METHOD, URL, RESPONSE(response as var file, we assigned above as articles.json value )
                
    })

    cy.get('app-article-list button').eq(1).click().should('contain', '6')//assettion to check the value of the second button which we click on
   })

        
it.only('Intercepting and modifying the request and response Lesson 40 (second part)', () => {
    // cy.intercept('POST', '**/articles', (req) => {
    //     req.body.article.description = "Nothing to do 2"//made it shortly - request object
    // }).as('postArticle')        //in order to get request body and responce to check them 

    //using response body:
    cy.intercept('POST', '**/articles', (req) => {
        req.reply( res => {
            expect(res.body.article.description).to.equal('Nothing to do')//made it shortly - request object
            res.body.article.description = 'Nothing to do 2'//what we want in response
        
    }).as('postArticle') 
       

        //making a call"
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('Title 1 intercept')
        cy.get('[formcontrolname="description"]').type('Nothing to do')
        cy.get('[formcontrolname="body"]').type('There is no evidence')
        cy.contains('Publish Article').click()

        cy.wait('@postArticle').then( xhr => {
            console.log(xhr)        //checking recponse on our calls and interceptions:
                
        expect(xhr.response.statusCode).to.equal(201)
        expect(xhr.request.body.article.title).to.equal('Title 1 intercept')
        expect(xhr.request.method).to.equal('POST')
        expect(xhr.body.article.description).to.equal('Nothing to do 2')
        })
        cy.contains('button', 'Delete Article').click()//clean up after test
          
     })   
})
})
