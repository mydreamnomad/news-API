
const API_KEY = `3d6fc6f72c01485587cf6b0a40441c9d`
let newsList = []
let menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click",(event) => getNewsByCategory(event)))
let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`)
let page = 1
let totalResults = 0
let pageSize = 10
let groupSize = 5

const getNews = async() => {
    try{
        url.searchParams.set("page", page)
        url.searchParams.set("pageSize", pageSize)
        let response = await fetch(url)
        let data = await response.json()
        if(response.status === 200){
            newsList = data.articles
            totalResults = data.totalResults
            render()
            pagiNationRender()
        }else{
            throw new Error(data.message)
        }
    }catch(error){
        errorRender(error.message)
    }
    
   
}

const getLatestNews = async() => {
    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`)
    getNews()
}

const getNewsByCategory = async(event) => {
    let category = event.target.textContent.toLowerCase()
    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`)
    getNews()
}

const getNewsByKeyword = async() => {
    let keyword = document.getElementById("search-input").value
    url = new URL(`https://newsapi.org/v2/everything?q=${keyword}&apiKey=${API_KEY}`)
    getNews()
}

const render = () => {
    let newsHTML = newsList.map(news => `<div class="row">
                <div class="col-lg-4">
                    <img class="news-img-size" src="${news.urlToImage}" alt="">
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                    <p>${news.description}</p>
                    <div>${news.publishedAt}</div>
                </div>
            </div>`).join('')
    document.getElementById("news-board").innerHTML = newsHTML        
}

const errorRender = (errorMessage) => {
    let errorHTML = `<div class="alert alert-danger" role="alert">
                    ${errorMessage}
                    </div>`
    document.getElementById("news-board").innerHTML = errorHTML                
}

const pagiNationRender = () => {
    let totalPages = Math.ceil(totalResults/pageSize)
    let pageGroup = Math.ceil(page/groupSize)
    let lastPage = pageGroup * groupSize
    let firstPage = lastPage - (groupSize -1) <=0 ? 1: lastPage - (groupSize -1)

    let pagiNationHTML = `<li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link">Previous</a></li>`

    for(let i = firstPage; i<= lastPage; i++){
        pagiNationHTML += `<li class="page-item ${i === page ? "active": ""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }
    pagiNationHTML += `<li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link">Next</a></li>`

    document.querySelector(".pagination").innerHTML = pagiNationHTML
}

const moveToPage = (pageNum) => {
    page = pageNum
    getNews()
}

getLatestNews()