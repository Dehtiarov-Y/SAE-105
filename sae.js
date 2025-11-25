let param = new URLSearchParams(location.search);
let presentation = param.get("num");

let AC_Liste = "";
let ac_SAE = SAE[presentation].AC;
let cle = Object.keys(ac_SAE);
for (let i = 0; i < cle.length; i++) {
    let cle_ac = cle[i];
    AC_Liste += "<p class='SAE_sous_Categorie'>" + cle_ac + " : " + ac_SAE[cle_ac]; +"</p>";
}

let ressource_liste = "";
let ressources_SAE = SAE[presentation].ressources;
let cle1 = Object.keys(ressources_SAE)
for (let i = 0; i < cle1.length; i++) {
    let cle_res = cle1[i]
    ressource_liste += "<p class='SAE_sous_Categorie'>" + cle_res + " : " + ressources_SAE[cle_res]; +"</p>";
}

let presentation_SAE = "<h3>Semestre : <span class='SAE_Categorie'>" + SAE[presentation].semestre + "</span></h3><h3>Compétences :</h3><div class='SAE_Categorie'>" + SAE[presentation].compétences + "</div><h3>Description :</h3><div class='SAE_Categorie'>" + SAE[presentation].description + "</div><h3>Apprentissage Critique :</h3><div>" + AC_Liste + "</div><h3>Ressources :</h3><div>" + ressource_liste + "</div>";

document.querySelector("main").innerHTML = presentation_SAE;
document.querySelector("h1").innerText = presentation;
document.querySelector("h2").innerText = SAE[presentation].titre;