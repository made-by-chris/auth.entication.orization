
document.querySelector("#test").addEventListener("click", handleClick);
function handleClick() {
    fetch("http://localhost:8080/test",{
        method: "GET",
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => console.log(data));
}

