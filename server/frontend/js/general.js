async function loadTemplate(path) {
	// return an template await response text => used to get templates, like overlays, ...
	// fetch response
	const response = await fetch(path);
	// turn into Promise<string>
	const template = await response.text();
	// return template
	return template;

}

var loadingIntro = new Promise(loadIntro)

async function loadIntro(resp) {
	var introConfig = await (await fetch("/js/intro.json")).json()
	var filename = (window.location.pathname).substring(window.location.pathname.lastIndexOf('/') + 1);
	var location =  filename != "" ? filename.split(".")[0] : "index"
	var config = introConfig.options
	console.log(location)
	config.steps = introConfig.tours[location]
	console.log(config)
	var intro = introJs().setOptions(config)
	intro.oncomplete(() => {
		window.location.href = `${introConfig.tours[location].next_page}?intro`
	})
	resp(intro)
}

document.addEventListener("DOMContentLoaded", e => {
	var elem = document.getElementById("navigation-bar");
	var pathname = window.location.pathname
	var location = pathname.endsWith("/") ? pathname + "index.html" : pathname;

	Array.from(elem.children).forEach(child => {
		let path = child.href.split("/");
		if (location.endsWith(path[path.length - 1])) {
			child.firstChild.classList.add("w3-bottombar")
			child.firstChild.classList.add("w3-border-theme")
		}
	})
	
	if (new URLSearchParams(window.location.search).has("intro")) {
		loadingIntro.then((intro) => { intro.start() })
	}
    

	try {
		document.getElementById("greeting").addEventListener("click", () => {
			loadingIntro.then((intro) => { intro.start() })
		})
	} catch {}
})