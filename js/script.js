// On détecte sur quelle page on est
var bodyId = document.body.id;

if (bodyId == "page-projects") {
    // Si on est sur la page de la grille, on charge la grille
    chargerGrilleProjets();
} else if (bodyId == "page-sae-detail") {
    // Si on est sur la page de détail, on charge les détails
    chargerDetailSAE();
}

/**
 * Fonction pour charger la grille des projets sur projects.html
 * (Cette fonction est entièrement réécrite pour trier par semestre)
 */
function chargerGrilleProjets() {
    // ИЗМЕНЕНИЕ: Мы целимся в новый контейнер
    var mainContainer = document.querySelector("#semestres-container");
    if (!mainContainer) return; // Sécurité

    // 1. Создаем "карманы" для HTML-кода каждого семестра
    var htmlSemestre1 = "";
    var htmlSemestre2 = "";
    // (Ты можешь легко добавить htmlSemestre3, htmlSemestre4 и т.д. в будущем)

    var clesSAE = Object.keys(SAE); 

    // 2. Сортируем все SAE по семестрам
    for (var i = 0; i < clesSAE.length; i++) {
        var cle = clesSAE[i];
        var sae = SAE[cle];

        var imgSrc = sae.image_preview || 'https://via.placeholder.com/300x180.png?text=Image+non+disponible';
        var competencesTexte = sae.compétences.join(', ');

        // Собираем HTML для ОДНОЙ карточки
        var carteHtml = 
            '<div class="sae-card">' +
                '<div class="preview-image">' +
                    '<img src="' + imgSrc + '" alt="Aperçu ' + sae.titre + '">' +
                '</div>' +
                '<h2>' + cle + '</h2>' +
                '<p>' + sae.titre + '</p>' +
                '<a href="sae.html?num=' + cle + '" class="btn">' + competencesTexte + '</a>' +
            '</div>';
        
        // Помещаем HTML карточки в правильный "карман"
        if (sae.semestre == 1) {
            htmlSemestre1 += carteHtml;
        } else if (sae.semestre == 2) {
            htmlSemestre2 += carteHtml;
        }
        // (Добавь 'else if (sae.semestre == 3)' здесь в будущем)
    }

    // 3. Собираем финальный HTML для всей страницы
    var finalHtml = "";

    // Добавляем секцию Семестра 1, только если в ней есть проекты
    if (htmlSemestre1.length > 0) {
        finalHtml += '<h2 class="semestre-titre">Semestre 1</h2>'; // Новый заголовок
        finalHtml += '<section class="sae-grid">' + htmlSemestre1 + '</section>'; // Оборачиваем в сетку
    }

    // Добавляем секцию Семестра 2, только если в ней есть проекты
    if (htmlSemestre2.length > 0) {
        finalHtml += '<h2 class="semestre-titre">Semestre 2</h2>'; // Новый заголовок
        finalHtml += '<section class="sae-grid">' + htmlSemestre2 + '</section>'; // Оборачиваем в сетку
    }

    // 4. Вставляем все на страницу ОДНИМ действием
    mainContainer.innerHTML = finalHtml;
}


/**
 * Fonction pour charger les détails sur sae.html
 * (Эта часть - твой код из sae.js, немного исправленный)
 */
function chargerDetailSAE() {
    var param = new URLSearchParams(location.search);
    var presentation = param.get("num"); // Récupère "SAE101", "SAE102", etc.

    if (!presentation || !SAE[presentation]) {
        document.querySelector("main").innerHTML = "<p class='erreur'>Cette SAÉ n'existe pas.</p>";
        var header = document.querySelector("#sae-header");
        if (header) header.style.display = 'none';
        return;
    }

    var sae = SAE[presentation]; 

    var AC_Liste = "";
    var ac_SAE = sae.AC;
    var cle_ac_liste = Object.keys(ac_SAE); 
    
    for (var i = 0; i < cle_ac_liste.length; i++) {
        var cle_ac = cle_ac_liste[i];
        // Исправлена ошибка: +"</p>" -> + "</p>"
        AC_Liste += "<p class='SAE_sous_Categorie'><strong>" + cle_ac + " :</strong> " + ac_SAE[cle_ac] + "</p>";
    }

    var ressource_liste = "";
    var ressources_SAE = sae.ressources;
    var cle_res_liste = Object.keys(ressources_SAE); 
    
    for (var i = 0; i < cle_res_liste.length; i++) {
        var cle_res = cle_res_liste[i];
         // Исправлена ошибка: +"</p>" -> + "</p>"
        ressource_liste += "<p class='SAE_sous_Categorie'><strong>" + cle_res + " :</strong> " + ressources_SAE[cle_res] + "</p>";
    }

    // Используем .join(), так как competences - это массив
    var competencesHtml = sae.compétences.join(', ');

    var presentation_SAE = 
        "<h3>Semestre : <span class='SAE_Categorie'>" + sae.semestre + "</span></h3>" +
        "<h3>Compétences :</h3><div class='SAE_Categorie'>" + competencesHtml + "</div>" +
        "<h3>Description :</h3><div class='SAE_Categorie'>" + sae.description + "</div>" +
        "<h3>Apprentissage Critique :</h3><div>" + AC_Liste + "</div>" +
        "<h3>Ressources :</h3><div>" + ressource_liste + "</div>";

    // Обновляем заголовок и контент
    document.querySelector("#sae-header").innerHTML = "<h1>" + presentation + " : " + sae.titre + "</h1>";
    document.querySelector("#sae-content").innerHTML = presentation_SAE;
}