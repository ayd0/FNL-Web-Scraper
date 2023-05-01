const searchInp = document.querySelector("#search-inp");
const searchBtn = document.querySelector("#search-btn");
const clearBtn = document.querySelector("#clear-btn");

const loadingAlert = document.querySelector('#loading-alert');
const searchResults = document.querySelector("#searchResults")

const handleSearchBtn = () => {
    // deactivate until data received
    if (searchInp.value === "") return;
    const req = JSON.stringify({ search: searchInp.value }, null, 2);
    console.log(req);
    toggleLoadingAlert();
    fetch("http://localhost:3000/", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: req,
    })
        .then((response) => response.json())
        .then((response) => injectResults(response));
};

const toggleLoadingAlert = () => {
    loadingAlert.classList.contains("d-none")
        ? loadingAlert.classList.replace("d-none", "d-block")
        : loadingAlert.classList.replace("d-block", "d-none");
}

const injectResults = (results) => {
    toggleLoadingAlert();
    if (!results) {
        console.log(
            `ERROR: Did not receive valid response object\nReceived:(${typeof(results)}): ${results}`
        );
        return;
    }
    for (result of results) {
        const li = document.createElement('li');
        li.innerText = `${result.partNum}: ${result.partDesc}`
        searchResults.appendChild(li);
    }
};

const handleClearBtn = () => {
    while (searchResults.firstChild) searchResults.removeChild(searchResults.firstChild);
}

searchBtn.addEventListener("click", handleSearchBtn);
clearBtn.addEventListener("click", handleClearBtn);